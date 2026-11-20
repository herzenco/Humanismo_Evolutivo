# Phase 1 audit handoff

This branch is based on `dev` at PR #63. QA already serves PR #64, which promoted #63. Keep #63's click-to-load players, privacy links, contact reflow fixes.

## Supabase callers for the admin migration PR

| Function | Callers found in the public website |
| --- | --- |
| `public.submit_contact_submission(text, text, text, text, text, boolean, text)` | `POST /api/contact` in `src/app/api/contact/route.ts`, reached by the public contact form after Turnstile verification. Uses the existing cookie-aware Supabase client and must continue to accept anonymous intake. |
| `public.submit_education_interest(text, text, text)` | No caller on the audited website branches. PR #63 removed the inactive waitlist. The audit branch refers to a legacy caller. Confirm any deployed or external callers with the education owner before revoking execution. |
| `public.list_contact_submissions()` | `GET /api/contact` in `src/app/api/contact/route.ts`. Uses the cookie-aware client and relies on the security-definer RPC, which checks `education_qa_private.is_admin()` and grants execution to `authenticated` only. The route has no separate admin check. Adding `getAdminClient()` there is optional later hardening. |
| `public.has_role(public.app_role, uuid)` | No direct call on the audited website branches. The generated types declare it. The website admin helper queries `user_roles`; the admin migration PR should verify any indirect RLS, view, trigger and function dependencies in the deployed schema. |

The caller search covered tracked website source and SQL on `main`, `dev`, `qa` and the audit branch. It establishes the website callers. Admin owns the deployed-schema and cross-service inventory before changing grants. Hold `20261112175820_harden_public_security_definer_functions.sql`, its tests and the website implementation that requires a privileged key. Keep the current anon-capable RPC path.

The production website uses `qlqkdininewormskpnya` for `NEXT_PUBLIC_SUPABASE_URL` and live Marketing `iwtcdjkawcjsxmwhzlot` for `NEWSLETTER_SUPABASE_URL`. QA also uses live Marketing. QA validation is read-only, including forms. The future Marketing Staging move is outside this release.

## Retained branches outside QA ancestry

- `fix/qa-report-evidence` holds the three screenshots in open PR #47. Herzen owns its closure decision. The Oct 29 wording decision supersedes the PR description.
- `fix/linear-production-comments` ends with a fix to isolate newsletter backend configuration.
- `fix/oct20-qa-review` ends with evidence about demo registration timing and missing logs.
- `refactor_design` ends with redesign handoff adjustments across breakpoints.

All four branches are retained as directed.

## Reconciliation decisions

- Browser headers use the policies compatible with the current pages. The audit's full source CSP and narrower image host list need a verified inventory of OCC image hosts, Blob media and external players. The audit's HSTS subdomain setting also needs review outside the two website projects.
- The accessibility statement needs approval for its support contact, response-time commitment and limitations. Its route, footer link and sitemap entry were held with the copy. The broader automated accessibility scan belongs to Phase 2.
- The footer boletín is a first-party form (Supabase plus Resend). LeadConnector was removed on Nov 20, 2026. The chatbot stays out of the sitemap. The existing public YouTube video page was added.
- The first-visit home video overlay uses native playback controls and restores focus on close. It and other legacy players still reference Blob-hosted clips, including the author introduction and the philosophers video. Replacing them requires the approved unlisted YouTube links before release. There are no tracked MP4, MOV or WebM files.
- No merge was performed. The audit changes were selected against current `dev`, so there were no Git merge conflicts. The existing portal flag guards in-site routes and their legacy redirects. The header, footer and homepage continue to link directly to the external education site.
- The audit pin of `@vercel/blob@2.4.0` removes the dependency chain through `@vercel/oidc` and `@vercel/cli-config` to a nested Zod release affected by [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5). The audit of this lockfile reported zero production dependency advisories.
