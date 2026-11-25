begin;

alter table public.newsletter_subscriptions
  add column if not exists signup_sources text[] not null default '{}'::text[];
update public.newsletter_subscriptions set signup_sources = array['boletin'] where signup_sources = '{}';

create function public.signup_newsletter_from_source(
  p_email text, p_name text, p_locale text, p_consent boolean, p_ip_hash text,
  p_confirm_hash text, p_unsubscribe_hash text, p_source text
) returns text
language plpgsql security definer set search_path = '' as $$
declare outcome text;
begin
  if p_source is null or p_source !~ '^(boletin|pregunta-(3[5-9]|4[0-9]|5[01]))$' then raise invalid_parameter_value; end if;
  outcome := public.signup_newsletter(p_email, p_name, p_locale, p_consent, p_ip_hash, p_confirm_hash, p_unsubscribe_hash);
  if outcome = 'send' then
    update public.newsletter_subscriptions
      set signup_sources = case
        when p_source = any(signup_sources) then signup_sources
        else array_append(signup_sources, p_source)
      end
    where lower(email) = lower(btrim(p_email)) and confirm_token_hash = p_confirm_hash;
  elsif outcome = 'skip' then
    update public.newsletter_subscriptions
      set signup_sources = array_append(signup_sources, p_source)
    where lower(email) = lower(btrim(p_email)) and status in ('pending', 'confirmed')
      and not (p_source = any(signup_sources));
  end if;
  return outcome;
end $$;

create table public.book_download_contacts (
  email text primary key check (email = lower(btrim(email)) and char_length(email) <= 254),
  name text not null check (char_length(name) between 1 and 100),
  books jsonb not null check (jsonb_typeof(books) = 'object'),
  last_download_at timestamptz not null default now()
);
create index book_download_contacts_order on public.book_download_contacts (last_download_at desc, email);
alter table public.book_download_contacts enable row level security;
revoke all on public.book_download_contacts from public, anon, authenticated;

create table public.book_download_rate_events (
  kind text not null check (kind in ('ip', 'email')),
  subject_hash text not null,
  occurred_at timestamptz not null default now()
);
create index book_download_rate_subject on public.book_download_rate_events (kind, subject_hash, occurred_at);
create index book_download_rate_expiry on public.book_download_rate_events (occurred_at);
alter table public.book_download_rate_events enable row level security;
revoke all on public.book_download_rate_events from public, anon, authenticated;

create function public.record_book_download_contact(
  p_email text, p_name text, p_book_id text, p_book_title text, p_ip_hash text
) returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  address text := lower(btrim(p_email));
  email_hash text := encode(sha256(convert_to(address, 'UTF8')), 'hex');
begin
  if address is null or address !~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$'
    or p_ip_hash is null or p_ip_hash !~ '^[0-9a-f]{64}$'
    or p_book_id is null or p_book_id !~ '^[a-z0-9]+(-[a-z0-9]+)*$'
    or char_length(p_book_id) > 120 or p_book_title is null or char_length(p_book_title) not between 1 and 200
  then raise invalid_parameter_value; end if;

  perform pg_advisory_xact_lock(4, hashtext(p_ip_hash));
  perform pg_advisory_xact_lock(5, hashtext(email_hash));
  if (select count(*) from public.book_download_rate_events where kind = 'ip' and subject_hash = p_ip_hash
    and occurred_at > now() - interval '10 minutes') >= 10
    or (select count(*) from public.book_download_rate_events where kind = 'email' and subject_hash = email_hash
    and occurred_at > now() - interval '1 hour') >= 10 then
    return false;
  end if;
  delete from public.book_download_rate_events where occurred_at <= now() - interval '1 hour';
  insert into public.book_download_rate_events (kind, subject_hash) values ('ip', p_ip_hash), ('email', email_hash);
  insert into public.book_download_contacts as contacts (email, name, books)
    values (address, btrim(p_name), jsonb_build_object(p_book_id, p_book_title))
    on conflict (email) do update set name = excluded.name, books = contacts.books || excluded.books,
      last_download_at = greatest(contacts.last_download_at, now());
  return true;
end $$;

do $$
begin
  if to_regclass('public.book_downloads') is not null then
    execute $backfill$
      with downloads as (
        select lower(btrim(email)) as email, left(btrim(name), 100) as name,
          left(btrim(book_downloaded), 200) as title, created_at
        from public.book_downloads
        where char_length(btrim(email)) between 3 and 254
          and char_length(btrim(name)) > 0 and char_length(btrim(book_downloaded)) > 0
      ), keyed as (
        select *, case lower(title)
          when 'yo soy nosotros' then 'yo-soy-nosotros'
          when 'i am us' then 'yo-soy-nosotros'
          when 'ecología y espiritualidad' then 'ecologia-y-espiritualidad'
          when 'ecology and spirituality' then 'ecologia-y-espiritualidad'
          when 'déjalo ser' then 'dejalo-ser'
          when 'let it be' then 'dejalo-ser'
          when 'el arte de ser empresario' then 'el-arte-de-ser-empresario'
          when 'the art of being an entrepreneur' then 'el-arte-de-ser-empresario'
          when 'y lo mejor aún está por venir' then 'lo-mejor-esta-por-venir'
          when '¡y lo mejor aún está por venir!' then 'lo-mejor-esta-por-venir'
          when 'the best is yet to come (spanish edition)' then 'lo-mejor-esta-por-venir'
          else 'legacy:' || lower(title) end as book_key
        from downloads
      )
      insert into public.book_download_contacts (email, name, books, last_download_at)
        select email, (array_agg(name order by created_at desc nulls last, name))[1],
          jsonb_object_agg(book_key, title order by created_at nulls first, title),
          coalesce(max(created_at), now())
        from keyed group by email on conflict (email) do nothing
    $backfill$;
    revoke insert on table public.book_downloads from public, anon, authenticated;
  end if;
end $$;

revoke all on function public.signup_newsletter_from_source(text,text,text,boolean,text,text,text,text),
  public.record_book_download_contact(text,text,text,text,text) from public, anon, authenticated;
grant execute on function public.signup_newsletter_from_source(text,text,text,boolean,text,text,text,text),
  public.record_book_download_contact(text,text,text,text,text) to service_role;

commit;
