# Independent course workspaces

The initial catalog contains 146 classes: Yo Soy Nosotros (45), Ecología y Espiritualidad (45), Humanismo Evolutivo Transpersonal (45), and El arte de ser empresario (11). Each course has its own program route and each class has its own route, source material and private saved reflection.

Class material was imported from the four supplied program PDFs, preserving the class titles, metadata, summary, objectives, concepts, full session development, reflection questions and reading assignments. Repeated PDF headers/page numbers and soft line wraps are removed. General back matter is not appended to the last class. These are authored classroom plans, including original suggested activities; no missing videos or assessments have been invented.

To regenerate with Python and pypdf:

```sh
python3 scripts/import-course-pdfs.py --source-dir /path/to/the/four/pdfs
```

`course-catalog.json` contains titles only and is safe for the client. Full lesson text in `course-content.json` is imported exclusively from the server class page **after** authentication and the database access check. No full-program PDF is exposed as a public download that would bypass sequence restrictions.

## Completion and privacy

Each authenticated, confirmed email account has independent course progress. Lesson 1 is available initially; lesson N+1 opens after lesson N is completed. Completed classes remain readable/editable. Completion requires a learner's confirmation of review/exercises and a saved reflection of at least 20 characters, up to 20,000. This is self-attested completion, not an exam score or proof of time spent. Draft saving does not unlock the next class. Saving or repeating a completed class never lowers progress.

The database locks the per-user/course progress row during save/completion and rejects out-of-order read, save and complete calls. Private tables have RLS and no client table grants. A private, narrowly scoped definer function validates identity and sequence; its public RPC wrapper uses invoker rights. Responses and reflections are visible only to their owner through this RPC. Personal course progress is independent of school memberships; this feature does not expose writing or introduce school-level reports.

The app fails closed when the database is unavailable: class text is withheld and a retry message is displayed. Progress is never inferred from local storage, role preview query parameters or URL parameters.

## Rollout

Apply `supabase/migrations/20261021165012_portal_course_progress.sql` to the intended environment before enabling this application version. It creates an additive `learning_private` schema and `portal_learning_access` RPC, without modifying existing education or Auth records. Use the existing release path: feature → dev → qa; validate QA with the migration installed, then obtain human QA approval before qa → main. No remote migration or production release was performed during implementation.

## Verification

- `npm test`: 45 tests passed, including real PostgreSQL (PGlite) tests of locked reads/writes/completions, persistence, repeat completion, cross-course independence, cross-user privacy, direct table access denial, invalid/anonymous access, and the final class boundary.
- `npx tsc --noEmit --incremental false` and focused ESLint: passed.
- `next build --webpack`: passed. Turbopack build stalled in the local sandbox; the webpack production build completed successfully.
- Browser against the actual Next UI/API and an isolated PGlite-backed Supabase-compatible fixture: four course cards, direct class-3 URL denied, draft save/reload, completion 1 → 2 → 3, revisiting 1/2/3, an unrelated course still locked, no page errors and no horizontal overflow at 390px. Desktop/mobile screenshots are in `screenshots/`.

To repeat the browser flow, start a **fresh** `node scripts/learning-preview-server.mjs` (port 54339), then:

```sh
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54339 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=fixture-key npx next dev --port 3036
# In another terminal, with Playwright available:
node scripts/verify-learning-browser.mjs
```

The browser script supports `PLAYWRIGHT_MODULE_PATH` and `CHROME_EXECUTABLE_PATH`. Test auth and data exist only in the local fixture; no application authentication bypass was added. Live Supabase configuration and QA deployment remain release validation steps.
