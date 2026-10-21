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

## Student dashboard and in-person attendance

The portal now opens on **Mi aprendizaje**, with separate measures for teacher-recorded in-person attendance and completed online lessons. Summary cards show unique present sessions, courses with at least one present session, completed online lessons, and courses with online participation. Each of the four course cards shows completed lessons, a completion percentage, its in-person attendance count, and a continue action. Zero records display zero; unavailable sources display an unavailable state rather than a fabricated zero.

In-person attendance is **not** inferred from opening a lesson, completing a lesson or viewing a scheduled session. A teacher uses **Pasar lista** to mark present/absent for an active student in their active school. Authorized platform administrators retain oversight through the existing server-verified admin/MFA contract. Students cannot mark their own attendance or access a roster. School/teacher/student activity status is checked again on writes, updates are auditable, duplicate marks do not inflate attendance, and present/absent changes never modify or unlock online course progress. The same scheduled session marked in multiple schools counts once for the student's attendance total. Unmarked sessions are not counted as absences.

Apply `20261021212020_teacher_attendance_dashboard.sql` after the existing school-access and course-progress migrations. Attendance uses the existing `EDUCATION_ACCESS_ENVIRONMENT=qa` activation switch. Scheduled sessions are seeded from the supplied schedule, not generated from recurrence assumptions. Adding future dated sessions requires updating both that source and the authoritative database session catalog.

**Calendario** is now a list grouped by course, showing each course title once. The list covers all 23 supplied dated sessions across 10 scheduled course titles; the four published online programs remain separate from the broader supplied school schedule. Accent-insensitive search by course/date/location intersects with a course selector; clearing filters restores the complete list. Session details retain their supplied date/time, and linked published courses lead to the program without bypassing lesson locks. Times without a timezone preserve the source's wall-clock time and remain marked as unconfirmed.

Additional validation: 48 automated tests pass, including real PostgreSQL tests for teacher/student/admin permissions, school isolation, idempotent/corrected marks, audit records, unique attendance counts and independence from online participation. TypeScript, focused ESLint and webpack production build pass. Browser review exercised course search, intersected filters, the empty state, a teacher marking a student present, the student seeing that attendance count, and online completion updating participation without changing attendance. Screenshots show the actual local test accounts.

For the full local school/attendance preview, add `EDUCATION_ACCESS_ENVIRONMENT=qa` to the Next dev command above. The disposable fixture supports `student@example.test` and `teacher@example.test` with any nonempty test password. It starts with no attendance or course progress; browser review creates sample records through the actual UI.
