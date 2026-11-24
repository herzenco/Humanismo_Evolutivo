begin;

create table public.contact_rate_events (
  subject_hash text not null,
  occurred_at timestamptz not null default now()
);
create index contact_rate_events_subject_time on public.contact_rate_events (subject_hash, occurred_at);
create index contact_rate_events_time on public.contact_rate_events (occurred_at);
alter table public.contact_rate_events enable row level security;
revoke all on public.contact_rate_events from public, anon, authenticated;

create function public.submit_contact_submission_limited(
  p_name text, p_email text, p_phone text, p_subject text, p_message text, p_consent boolean,
  p_locale text, p_ip_hash text
) returns uuid
language plpgsql security definer set search_path = '' as $$
begin
  if p_ip_hash is null or p_ip_hash !~ '^[a-f0-9]{64}$' then
    raise invalid_parameter_value;
  end if;

  perform pg_advisory_xact_lock(3, hashtext(p_ip_hash));
  if (select count(*) from public.contact_rate_events
    where subject_hash = p_ip_hash and occurred_at > now() - interval '10 minutes') >= 5 then
    return null;
  end if;

  delete from public.contact_rate_events where occurred_at <= now() - interval '1 day';
  insert into public.contact_rate_events (subject_hash) values (p_ip_hash);
  return public.submit_contact_submission(p_name, p_email, p_phone, p_subject, p_message, p_consent, p_locale);
end;
$$;

revoke all on function public.submit_contact_submission(text, text, text, text, text, boolean, text)
  from public, anon, authenticated, service_role;
revoke all on function public.submit_contact_submission_limited(text, text, text, text, text, boolean, text, text)
  from public, anon, authenticated;
grant execute on function public.submit_contact_submission_limited(text, text, text, text, text, boolean, text, text)
  to service_role;

commit;
