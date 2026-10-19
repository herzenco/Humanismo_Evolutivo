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
