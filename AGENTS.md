<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Branch and release workflow

Work on `feature/<name>` or `fix/<name>` branches created from the latest `dev`. Promote changes by pull request in this order: feature/fix → `dev` → `qa` → `main` (production). Validate at https://qa.humanismoevolutivo.com before promoting `qa` to `main`. Never include unrelated local edits or reset another task's work. See `docs/RELEASE_WORKFLOW.md` for deployment mapping and release rules.
