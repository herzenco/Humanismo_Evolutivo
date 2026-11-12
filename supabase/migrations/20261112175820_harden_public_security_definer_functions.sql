-- Public clients must not execute privileged write functions directly. The
-- website verifies Turnstile before calling contact intake with a server-only
-- Supabase secret. Admin reads remain available to authenticated users and
-- still perform their internal role check.
begin;

revoke all on function public.submit_contact_submission(text, text, text, text, text, boolean, text)
  from public, anon, authenticated;
grant execute on function public.submit_contact_submission(text, text, text, text, text, boolean, text)
  to service_role;

revoke all on function public.list_contact_submissions()
  from public, anon;
grant execute on function public.list_contact_submissions()
  to authenticated;

revoke all on function public.has_role(public.app_role, uuid)
  from public, anon;
grant execute on function public.has_role(public.app_role, uuid)
  to authenticated;

-- This legacy intake is no longer called by the public website. Keep it
-- available only to trusted server code until its owning app removes it.
revoke all on function public.submit_education_interest(text, text, text)
  from public, anon, authenticated;
grant execute on function public.submit_education_interest(text, text, text)
  to service_role;

commit;
