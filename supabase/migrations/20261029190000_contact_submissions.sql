-- Contact form intake. Visitors insert only through the server route's
-- security definer function. Platform admins are the only readers.
begin;
create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  email text not null check (char_length(email) <= 254 and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  phone text check (phone is null or char_length(phone) <= 40),
  subject text not null check (char_length(btrim(subject)) between 1 and 160),
  message text not null check (char_length(btrim(message)) between 1 and 5000),
  consent boolean not null check (consent),
  locale text not null default 'es' check (locale in ('es','en')),
  created_at timestamptz not null default now()
);
alter table public.contact_submissions enable row level security;
revoke all on public.contact_submissions from public, anon, authenticated;
create policy contact_submissions_admin_read on public.contact_submissions
  for select to authenticated
  using (education_qa_private.is_admin());

create function public.submit_contact_submission(
  p_name text, p_email text, p_phone text, p_subject text, p_message text, p_consent boolean, p_locale text
) returns uuid
language plpgsql security definer set search_path='' as $$
declare new_id uuid;
begin
  if p_consent is not true then raise invalid_parameter_value using message = 'Consent required'; end if;
  insert into public.contact_submissions(name, email, phone, subject, message, consent, locale)
  values (btrim(p_name), lower(btrim(p_email)), nullif(btrim(p_phone), ''), btrim(p_subject), btrim(p_message), true, case when p_locale = 'en' then 'en' else 'es' end)
  returning id into new_id;
  return new_id;
end $$;
revoke all on function public.submit_contact_submission(text, text, text, text, text, boolean, text) from public;
grant execute on function public.submit_contact_submission(text, text, text, text, text, boolean, text) to anon, authenticated;

create function public.list_contact_submissions()
returns jsonb language plpgsql security definer set search_path='' as $$
begin
  if not education_qa_private.is_admin() then raise insufficient_privilege; end if;
  return coalesce((select jsonb_agg(to_jsonb(row) order by row.created_at desc) from (
    select id, name, email, phone, subject, message, locale, created_at
    from public.contact_submissions
    order by created_at desc
    limit 200
  ) row), '[]');
end $$;
revoke all on function public.list_contact_submissions() from public;
grant execute on function public.list_contact_submissions() to authenticated;
commit;
