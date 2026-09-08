create table public.newsletter_subscriptions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  locale text not null default 'es',
  source text not null default 'website_footer',
  status text not null default 'subscribed',
  consented_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint newsletter_subscriptions_email_length
    check (char_length(email) between 3 and 254),
  constraint newsletter_subscriptions_email_normalized
    check (email = lower(btrim(email))),
  constraint newsletter_subscriptions_email_format
    check (email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  constraint newsletter_subscriptions_locale
    check (locale in ('es', 'en')),
  constraint newsletter_subscriptions_source
    check (source = 'website_footer'),
  constraint newsletter_subscriptions_status
    check (status in ('subscribed', 'unsubscribed'))
);

comment on table public.newsletter_subscriptions is
  'Email newsletter opt-ins captured by first-party website forms for future CRM synchronization.';

comment on column public.newsletter_subscriptions.consented_at is
  'Time the visitor submitted the newsletter opt-in form.';

create unique index newsletter_subscriptions_email_key
  on public.newsletter_subscriptions (email);

alter table public.newsletter_subscriptions enable row level security;

revoke all on table public.newsletter_subscriptions from anon, authenticated;
grant insert (email, locale) on table public.newsletter_subscriptions to anon, authenticated;
grant select on table public.newsletter_subscriptions to authenticated;

create policy "visitors can subscribe to newsletter"
  on public.newsletter_subscriptions
  for insert
  to anon, authenticated
  with check (
    email = lower(btrim(email))
    and char_length(email) between 3 and 254
    and locale in ('es', 'en')
    and source = 'website_footer'
    and status = 'subscribed'
  );

create policy "admins can read newsletter subscriptions"
  on public.newsletter_subscriptions
  for select
  to authenticated
  using (public.has_role('admin'::public.app_role, (select auth.uid())));
