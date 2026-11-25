begin;

alter table public.newsletter_subscriptions
  add column confirmation_attempted_at timestamptz;

create or replace function public.signup_newsletter(p_email text, p_name text, p_locale text, p_consent boolean,
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

  if current_row.status = 'pending'
    and current_row.confirmation_attempted_at > now() - interval '1 minute' then
    return 'busy';
  end if;

  insert into public.newsletter_subscriptions (email, name, locale, consented_at,
    confirm_token_hash, confirm_token_expires_at, confirmation_attempted_at, unsubscribe_token_hash)
  values (address, nullif(btrim(p_name), ''), p_locale, now(), p_confirm_hash, now() + interval '48 hours', now(), p_unsubscribe_hash)
  on conflict (lower(email)) do update set
    name = excluded.name, locale = excluded.locale, status = 'pending',
    consented_at = now(), confirmed_at = null, unsubscribed_at = null,
    confirm_token_hash = excluded.confirm_token_hash,
    confirm_token_expires_at = excluded.confirm_token_expires_at,
    confirmation_sent_at = null, confirmation_attempted_at = now(), unsubscribe_token_hash = excluded.unsubscribe_token_hash,
    resend_contact_id = null, resend_segment_id = null, resend_synced_at = null, updated_at = now();
  insert into public.newsletter_rate_events (kind, subject_hash) values ('email', email_hash);
  return 'send';
end $$;

create function public.finish_newsletter_confirmation_delivery(p_confirm_hash text, p_sent boolean)
returns void language sql security invoker set search_path = '' as $$
  update public.newsletter_subscriptions
  set confirmation_sent_at = case when p_sent then now() else null end,
      confirmation_attempted_at = null,
      updated_at = now()
  where status = 'pending' and confirm_token_hash = p_confirm_hash
    and confirmation_attempted_at is not null;
$$;

grant select (status, confirm_token_hash, confirmation_attempted_at),
  update (confirmation_sent_at, confirmation_attempted_at, updated_at)
  on public.newsletter_subscriptions to service_role;

revoke all on function public.finish_newsletter_confirmation_delivery(text, boolean)
  from public, anon, authenticated;
grant execute on function public.finish_newsletter_confirmation_delivery(text, boolean) to service_role;

revoke all on function public.signup_newsletter(text, text, text, boolean, text, text, text),
  public.confirm_newsletter(text, text), public.unsubscribe_newsletter(text),
  public.mark_newsletter_synced(text, text, text) from public, anon, authenticated;
grant execute on function public.signup_newsletter(text, text, text, boolean, text, text, text),
  public.confirm_newsletter(text, text), public.unsubscribe_newsletter(text),
  public.mark_newsletter_synced(text, text, text) to service_role;
commit;
