# Development, QA, and production

Repository: https://github.com/herzenco/Humanismo_Evolutivo

1. Start each feature or fix from the latest `dev` in a clean checkout, using `feature/<name>` or `fix/<name>`.
2. Open a pull request into `dev`. Review and validate the feature using its Vercel preview.
3. Open a pull request from `dev` into `qa`. Merge when ready for QA.
4. Validate the resulting deployment at https://qa.humanismoevolutivo.com and record the QA result in the release pull request.
5. After QA approval, open and merge a pull request from `qa` into `main` to release production.

Do not push application changes directly to `qa` or `main`, and do not merge feature branches directly into either branch. Use merge commits for promotions so branch ancestry is preserved. Do not automatically delete the long-lived `dev` or `qa` branches.

## Deployment mapping

| Branch | Vercel project | Destination |
| --- | --- | --- |
| Feature branches and `dev` | `humnanismo-evolutivo` | Preview deployment URLs |
| `qa` | `humnanismo-evolutivo-qa` | https://qa.humanismoevolutivo.com |
| `main` | `humnanismo-evolutivo` | https://humanismoevolutivo.com |

The QA project is connected to this repository, tracks `qa` as its production branch, and ignores builds for other branches. Its production environment is the QA site, not the public production site. Environment variables remain scoped to their existing Vercel projects.

## Enforcement

The `Promotion policy` check requires `dev` → `qa` and `qa` → `main`, from this repository. Protected branches require pull requests and this check. The workflow uses `pull_request_target` only to inspect branch metadata; it never checks out or executes pull request code or receives deployment credentials.

QA approval is a human release step. The branch check verifies the promotion path; it does not replace application tests or assert that QA has passed. Administrators retain emergency bypass capability.

## Boletín and book downloads

- Set `NEWSLETTER_ENVIRONMENT`, `NEWSLETTER_SUPABASE_URL` and the server-only
  `NEWSLETTER_SUPABASE_SECRET_KEY` for the environment's subscriber database.
  Set the verified `NEWSLETTER_FROM_EMAIL`, `RESEND_API_KEY` and
  `RESEND_NEWSLETTER_SEGMENT_ID` for confirmation and delivery.
- Apply the existing newsletter schema, the confirmation delivery migration
  (`20261124170000_restrict_newsletter_intake.sql`) and the signup sources and
  download migration (`20261124183000_marketing_signup_sources_and_downloads.sql`)
  in the subscriber database. Both public forms write to that database.
  Coordinate database changes with the site deployment. Old newsletter and legacy book
  download routes use public permissions that the migrations revoke.
- The download migration imports existing `book_downloads` rows if the table
  is in that same database. If the old site wrote to a different database,
  move the historical rows through an authorized server-side import before
  cutting over. The migration does not query another project.
- Deploy the matching admin read functions after the marketing migration.
  Use the admin repository's `supabase/qa/marketing_leads_admin.sql` on isolated QA
  and `20261124183100_marketing_leads_admin.sql` for the production admin schema.
- Test a Boletín signup and a question signup including confirmation, then
  confirm both origins under Boletín in admin. Download two books with the
  same test address and verify one row with both books under Descargas de libros.
- After publishing a question video, use that question's origin tag in the
  confirmed Boletín contacts to send the availability announcement through
  the normal newsletter publishing workflow.

## Revista and Boletín archive in QA

Set `QA_RESOURCE_READER_TOKEN` to the reader credential configured in the
isolated admin QA database. If the public site uses a different Supabase
project for its browser client, also set `QA_RESOURCE_SUPABASE_PUBLISHABLE_KEY`
to the admin QA project's publishable key. The dedicated override is enabled
only for a deployment with the QA gate enabled. Revista and Boletín read
published entries at request time. After release, check the admin-published
article on the Revista listing and its article page.
