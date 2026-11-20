begin;

create table if not exists public.newsletter_subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null check (char_length(email) between 3 and 254 and email = lower(btrim(email))),
  locale text not null default 'es' check (locale in ('es', 'en')),
  source text not null default 'footer',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.newsletter_subscriptions
  drop constraint if exists newsletter_subscriptions_source,
  drop constraint if exists newsletter_subscriptions_status,
  drop constraint if exists newsletter_subscriptions_source_check,
  drop constraint if exists newsletter_subscriptions_status_check,
  drop constraint if exists newsletter_subscriptions_email_format;

alter table public.newsletter_subscriptions
  add column if not exists name text check (char_length(name) <= 120),
  add column if not exists consented_at timestamptz not null default now(),
  add column if not exists confirmed_at timestamptz,
  add column if not exists unsubscribed_at timestamptz,
  add column if not exists confirm_token_hash text,
  add column if not exists confirm_token_expires_at timestamptz,
  add column if not exists confirmation_sent_at timestamptz,
  add column if not exists unsubscribe_token_hash text,
  add column if not exists resend_contact_id text,
  add column if not exists resend_segment_id text,
  add column if not exists resend_synced_at timestamptz,
  add column if not exists updated_at timestamptz not null default now(),
  alter column source set default 'footer',
  alter column status set default 'pending';

update public.newsletter_subscriptions
set source = 'footer',
    status = case when status = 'subscribed' then 'pending' else status end
where source = 'website_footer' or status = 'subscribed';

alter table public.newsletter_subscriptions
  add constraint newsletter_subscriptions_email_format check (email ~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$'),
  add constraint newsletter_subscriptions_source_check check (source = 'footer'),
  add constraint newsletter_subscriptions_status_check check (status in ('pending', 'confirmed', 'unsubscribed'));
alter table public.newsletter_subscriptions drop constraint if exists newsletter_subscriptions_email_key;
drop index if exists public.newsletter_subscriptions_email_key;
create unique index if not exists newsletter_email_ci on public.newsletter_subscriptions (lower(email));
create index if not exists newsletter_created_at_id on public.newsletter_subscriptions (created_at desc, id desc);
create unique index if not exists newsletter_confirm_token on public.newsletter_subscriptions (confirm_token_hash);
create unique index if not exists newsletter_unsubscribe_token on public.newsletter_subscriptions (unsubscribe_token_hash);

alter table public.newsletter_subscriptions enable row level security;
revoke all on public.newsletter_subscriptions from public, anon, authenticated;
drop policy if exists "visitors can subscribe to newsletter" on public.newsletter_subscriptions;
drop policy if exists "admins can read newsletter subscriptions" on public.newsletter_subscriptions;

create table if not exists public.newsletter_rate_events (
  kind text not null check (kind in ('ip', 'email')),
  subject_hash text not null,
  occurred_at timestamptz not null default now()
);
create index if not exists newsletter_rate_subject on public.newsletter_rate_events (kind, subject_hash, occurred_at);
create index if not exists newsletter_rate_expiry on public.newsletter_rate_events (occurred_at);
alter table public.newsletter_rate_events enable row level security;
revoke all on public.newsletter_rate_events from public, anon, authenticated;

create function public.signup_newsletter(p_email text, p_name text, p_locale text, p_consent boolean,
  p_ip_hash text, p_confirm_hash text, p_unsubscribe_hash text)
returns text language plpgsql security definer set search_path = '' as $$
declare
  address text := lower(btrim(p_email));
  current_row public.newsletter_subscriptions;
  email_hash text := encode(sha256(convert_to(address, 'UTF8')), 'hex');
begin
  if p_consent is not true or p_ip_hash is null or p_confirm_hash is null or p_unsubscribe_hash is null
    or p_ip_hash !~ '^[0-9a-f]{64}$' or p_confirm_hash !~ '^[0-9a-f]{64}$'
    or p_unsubscribe_hash !~ '^[0-9a-f]{64}$' then
    raise invalid_parameter_value;
  end if;
  perform pg_advisory_xact_lock(1, hashtext(p_ip_hash));
  if (select count(*) from public.newsletter_rate_events where kind = 'ip'
    and subject_hash = p_ip_hash and occurred_at > now() - interval '10 minutes') >= 5 then
    return 'limited';
  end if;
  delete from public.newsletter_rate_events where occurred_at <= now() - interval '1 day';
  insert into public.newsletter_rate_events (kind, subject_hash) values ('ip', p_ip_hash);

  perform pg_advisory_xact_lock(2, hashtext(email_hash));
  select * into current_row from public.newsletter_subscriptions where lower(email) = address for update;
  if current_row.status = 'confirmed'
    or (current_row.status = 'pending' and current_row.confirmation_sent_at > now() - interval '10 minutes')
    or (select count(*) from public.newsletter_rate_events where kind = 'email'
      and subject_hash = email_hash and occurred_at > now() - interval '1 day') >= 5 then
    return 'skip';
  end if;

  insert into public.newsletter_subscriptions (email, name, locale, consented_at,
    confirm_token_hash, confirm_token_expires_at, confirmation_sent_at, unsubscribe_token_hash)
  values (address, nullif(btrim(p_name), ''), p_locale, now(), p_confirm_hash, now() + interval '48 hours', now(), p_unsubscribe_hash)
  on conflict (lower(email)) do update set
    name = excluded.name, locale = excluded.locale, status = 'pending',
    consented_at = now(), confirmed_at = null, unsubscribed_at = null,
    confirm_token_hash = excluded.confirm_token_hash,
    confirm_token_expires_at = excluded.confirm_token_expires_at,
    confirmation_sent_at = now(), unsubscribe_token_hash = excluded.unsubscribe_token_hash,
    resend_contact_id = null, resend_segment_id = null, resend_synced_at = null, updated_at = now();
  insert into public.newsletter_rate_events (kind, subject_hash) values ('email', email_hash);
  return 'send';
end $$;

create function public.confirm_newsletter(p_token_hash text, p_sync_hash text)
returns jsonb language sql security definer set search_path = '' as $$
  update public.newsletter_subscriptions
  set status = 'confirmed', confirmed_at = now(), updated_at = now(),
      confirm_token_hash = p_sync_hash, confirm_token_expires_at = now() + interval '5 minutes'
  where status = 'pending' and confirm_token_hash = p_token_hash and confirm_token_expires_at > now()
  returning jsonb_build_object('email', email);
$$;

create function public.unsubscribe_newsletter(p_token_hash text)
returns jsonb language sql security definer set search_path = '' as $$
  update public.newsletter_subscriptions
  set status = 'unsubscribed', unsubscribed_at = coalesce(unsubscribed_at, now()), updated_at = now(),
      confirm_token_hash = null, confirm_token_expires_at = null
  where unsubscribe_token_hash = p_token_hash
  returning jsonb_build_object('email', email, 'segment_id', resend_segment_id);
$$;

create function public.mark_newsletter_synced(p_sync_hash text, p_contact_id text, p_segment_id text)
returns boolean language sql security definer set search_path = '' as $$
  with synced as (
    update public.newsletter_subscriptions
    set resend_contact_id = p_contact_id, resend_segment_id = p_segment_id, resend_synced_at = now(),
        confirm_token_hash = null, confirm_token_expires_at = null, updated_at = now()
    where status = 'confirmed' and confirm_token_hash = p_sync_hash and confirm_token_expires_at > now()
    returning id
  )
  select exists(select 1 from synced);
$$;

revoke all on function public.signup_newsletter(text, text, text, boolean, text, text, text),
  public.confirm_newsletter(text, text), public.unsubscribe_newsletter(text),
  public.mark_newsletter_synced(text, text, text) from public, anon, authenticated;
grant execute on function public.signup_newsletter(text, text, text, boolean, text, text, text),
  public.confirm_newsletter(text, text), public.unsubscribe_newsletter(text),
  public.mark_newsletter_synced(text, text, text) to anon, authenticated;
commit;
