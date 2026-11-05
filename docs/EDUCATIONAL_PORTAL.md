# Educational portal

`/portal` retains the existing server-verified account boundary and no-index metadata. Navigation is URL-backed using `view=courses|library|calendar`; library category, item and course/lesson selections support refresh and browser back/forward without leaving the portal shell.

## Content audit (19 October 2026)

The repository has five books with PDFs (three are explicitly summaries), podcast series/episodes, videos, published OCC article snapshots and all 51 questions. The portal reuses those sources, with embedded readers/players and narrated-only question text. Article publication remains controlled by OCC; the current snapshot is empty. No sample articles are presented as published content.

No published course or class schedule was found in the application source, docs, supplied question folders or adjacent admin source. The original design package does contain a 2027 timetable, now archived verbatim in `content/portal/PortalCalendario.source.html`: two periods (15 February–15 June and 15 August–15 December), ten course names and 23 explicitly dated sessions on 15–20 February. Those explicit sessions are imported in `src/generated/portal-schedule.json`. The displayed claim of 724 sessions is not backed by complete dates/recurrence/holiday data. Later dates are left unconfigured until confirmed. The source also flags an unresolved second-period Saturday discrepancy and provides neither venue nor timezone; no timezone is inferred. The homepage's prototype “4 cursos · 146 clases” count is not backed by a course catalog. `src/data/events.ts` contains two public conferences dated September/October 2025; these are not educational classes and are excluded from the class calendar.

## Publishing supplied classes later

Add real courses to `portalCourses` in `src/data/portal.ts`: unique ID, title, description and lessons (ID, title, text, optional direct playable video URL). Mis cursos lists every available course; its detail lists lessons and opens their text/video inside the portal. No enrollment or progress figures are invented.

Add scheduled sessions to `portalClasses`: unique ID, matching courseId, title, ISO timestamp startsAt/endsAt (with explicit offset once confirmed), optional IANA timeZone and optional location. Calendar and list use the same chronological monthly collection; placement and displayed time use each class's timezone. Both views navigate months and return to the current month. Both views initially open the first supplied class month. Calendar days show class counts and a selected-day detail list; list view shows all classes in the month. Months without supplied dates show an explicit empty state. Scheduled class detail stays within the portal and does not link to unpublished lesson content.

## Verification

Run `npm test`, targeted ESLint, TypeScript and the application build. Check library/category/item navigation, refresh/back, book PDFs, Spotify/YouTube embeds, narrated questions, article empty state, course empty state, month controls, calendar/list parity, and mobile navigation/overflow. Authentication is unchanged; unauthenticated requests must continue to redirect to sign in.

### QA role walkthrough and calendar details

QA shows Estudiante, Maestro and Administrador view buttons. Assigned roles still use the authenticated education API and its server authorization. Accounts without those roles see an explicitly labeled fictional walkthrough, with in-memory records that reset on refresh; switching views never grants permissions or writes real records. The walkthrough includes multi-school student membership, the Amigos que Evolucionan community, school-scoped teacher activity/completion and retained historical records. No written answers are shown. Production does not enable these preview buttons. Local development can opt in with PORTAL_ROLE_PREVIEW=true.

The calendar displays each explicit class's time and name as its own link, with a larger horizontally scrollable month grid and a list alternative. Class details show the supplied date, time and location, and disclose missing course material/time zone rather than inventing them. The source remains the 23 explicit sessions of February 15–20, 2027.

Shared database activation remains pending approval; these presentation changes do not apply the education migration or enable its environment flag.
