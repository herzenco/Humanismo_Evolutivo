# Schools and education access

Implemented from the owner’s decisions on October 19, 2026. This foundation is QA-scoped; the platform admin management panel is the next phase.

## Current activation status

The migration has **not** been applied to the shared database. Automatic approval review rejected activation because the persistent schema and new owner management permission affect a shared QA/production project; explicit approval is required for this exact mutation. The code defaults to disabled, and no real institution membership or new privileged user was created.

## Identity and memberships

A school is a grouping, not a login identity. Supabase Auth remains the shared identity system. A person can hold multiple student memberships and, independently, one active teacher assignment. The global platform-admin capability comes from the existing central admin authorization system, not a school role or user-editable metadata.

Every verified user entering the enabled portal receives a student membership in **Amigos que Evolucionan**, the Humanismo Evolutivo community (`00000000-0000-4000-8000-000000000001`). This is retained when joining other schools. Existing identities are provisioned lazily on their next portal visit; no existing users are bulk-assigned to an institution.

Students may belong to several schools. A teacher may be a student elsewhere, but may teach only one active school at a time; a database unique index enforces this under concurrency. An admin must deactivate an old teacher assignment before assigning another school.

## Access matrix

| Capability | Student | Teacher | Platform admin |
| --- | --- | --- | --- |
| View own memberships / accept own invitations | Yes | Yes as learner | Yes as learner |
| Join a school without an invitation/assignment | No | No | Can assign memberships |
| Create/archive/reactivate schools | No | No | Yes |
| Assign/revoke teacher roles | No | No | Yes |
| Invite students | No | Own active school | Any active school |
| Change an existing student’s status | No | Own active school only | Any school |
| Leave a student membership | Own, except default community | Own learner memberships | Own learner memberships |
| View roster and activity/completion | Own activity | Own active teaching school | All schools |
| View school history after a student leaves | Own activity | Historical records in own school | Yes |
| View written answers, reflections or journals through these tools | No | No | No |
| Read access-change audit | No | No | Yes |

Teachers can reactivate suspended students; a student who left or was removed must accept a new invitation before a teacher can reinstate them. Historical roster identities are snapshots, so a former school does not receive later profile/contact changes.

Student removal retains memberships and immutable activity records for school history. Revoking a teacher immediately prevents new roster/report reads; no JWT refresh is needed. Archived schools reject student/teacher operations and remain visible to platform admins. No hard-delete operation is provided. Identity deletion must follow a separate coordinated retention process.

## Data and authorization boundaries

Private QA schema `education_qa_private`: schools, profiles, memberships, invitations, school activity ledger and audit. All tables enable RLS, have no direct client grants, and deny raw table reads/writes. Their names/tenant IDs cannot be used to bypass authorization. Only the explicitly granted `public.education_qa_access(text,jsonb)` security-invoker facade is exposed. Its private implementation checks verified non-anonymous identity, live memberships, school status and admin permission on every call; privileged functions use an empty search path and qualified object names.

Admin access reuses `authz.assert_current_admin_permission('education.qa.manage')`, including the central session/MFA policy. The migration adds this QA-specific permission only to the existing owner role; it creates no users or privileged memberships. Editors, CMS roles and legacy public-site admin flags do not automatically gain education administration. Future role grants must use the central admin permission system.

Activity is **explicitly associated with one school per event**, not copied into every school membership. The caller must pass the school the learner chose. `activity.record` verifies active student membership, then delegates to the existing QA class-opening/completion routines to retain publication, version and reading-depth checks. Event UUIDs are idempotent and cannot be replayed into another school/person/class/kind. Completion counts use distinct classes. No client-supplied timestamps or answers enter this ledger.

Existing learning records have no reliable school provenance. They are neither backfilled nor disclosed to a new school. Existing global personal progress remains intact. Future course readers must call this scoped facade with the selected school; they must not infer school ownership from a student’s other memberships. Existing owner-only reflection, quiz and journal policies remain unchanged.

## API contract for the next admin panel

`POST /api/education/access`, JSON `{ "action": "...", "input": {...} }`, requires a verified same-origin session. Responses are `{ "data": ... }`; errors return generic messages with 400/401/403/409/503 and `Cache-Control: private, no-store`. Lists accept `limit` (1–100) and `offset`. The typed source of truth is `src/lib/education/contracts.ts`.

| Action | Input beyond pagination | Purpose |
| --- | --- | --- |
| `context` | none | Identity, effective admin capability, memberships and default community |
| `schools.list` | none | Admin’s school inventory |
| `people.list` | none | Admin’s verified account inventory and education memberships |
| `schools.create` | name, slug | Create school |
| `schools.status` | schoolId, status | Archive/reactivate school |
| `memberships.set` | schoolId, userId, role, status | Assign teachers/students; suspend/remove/reactivate memberships |
| `memberships.leave` | schoolId | Leave one’s own non-community student membership |
| `invitations.create` | schoolId, email | Create or renew student invitation |
| `invitations.list` | schoolId | School’s invitation lifecycle |
| `invitations.revoke` | invitationId | Revoke a pending invitation |
| `invitations.mine` | none | Only invitations for the caller’s verified email |
| `invitations.accept` | invitationId | Accept a matching, unexpired invitation as student |
| `roster` | schoolId | Current/former members, school-only openings/completion counts |
| `activity.list` | schoolId, optional userId | Read explicit school activity only |
| `activity.mine` | optional schoolId | Caller’s personal school activity |
| `activity.record` | schoolId, eventId, classId, contentVersion, kind, depth for completion | Record an opening/completion in explicit school context |
| `audit.list` | optional schoolId | Admin-only access-change audit |

Invitations last 14 days. Creating one does not reveal whether an email has an account and sends no email. The matching verified account sees it inside Mis escuelas and chooses whether to accept. Suspending/removing a student revokes their pending school invitations; revoking a teacher also revokes pending invitations they created there. Archived schools revoke pending invitations. Other school and community memberships remain unchanged.

The minimal portal **Mis escuelas** view supports reviewing memberships, accepting invitations, a teacher’s school roster/history and student invitations. It is not a replacement for the forthcoming platform admin panel. The API supplies the school/account inventory, teacher assignment, student membership lifecycle and audit capabilities that panel will need.

## Activation and verification

QA and production currently share Supabase project `iwtcdjkawcjsxmwhzlot`. Apply only the QA-namespaced migration after verifying its prerequisites; never assume this is a separate QA database. New tables/facade do not alter existing learning/private-answer tables. The application activates this integration only when server-only `EDUCATION_ACCESS_ENVIRONMENT=qa`; leave production unset. The flag is deployment control, not authorization; database checks apply to direct RPC calls too.

The migration was generated with Supabase CLI and lives in `supabase/migrations/20261020005503_education_qa_school_access.sql`. Its prerequisites are the current central `authz` contract and QA learning opening/completion routines. `supabase/tests/education-school-fixture.sql` is an **isolated test fixture**, not a deployment migration; never apply it to a live database.

`npm test` runs real PostgreSQL tests via pinned PGlite, including migration execution, multiple school memberships, invitation acceptance/email matching, teacher uniqueness, tenant isolation, retained history, immediate revocation, archived schools, private-answer/journal isolation, anonymous/unverified access, MFA, metadata spoofing, raw-table denial and audit. Also run TypeScript, ESLint and a production build. No real identities are promoted or fake students inserted into the shared database by these tests.
