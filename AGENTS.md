<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Branch and release workflow

Work on `feature/<name>` or `fix/<name>` branches created from the latest `dev`. Promote changes by pull request in this order: feature/fix → `dev` → `qa` → `main` (production). Validate at https://qa.humanismoevolutivo.com before promoting `qa` to `main`. Never include unrelated local edits or reset another task's work. See `docs/RELEASE_WORKFLOW.md` for deployment mapping and release rules.
