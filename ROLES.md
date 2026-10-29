# Educational portal: roles, visibility and permissions

Agreed with the product owner on October 22, 2026.

**Status:** Product requirements established through the roles and permissions interview. This document records the intended behavior; it does not assert that every rule has been implemented. Existing code and database policies must be reconciled with these requirements.

## Core model

- Roles are cumulative. A person may be a platform administrator, school administrator, teacher and student at the same time.
- Permissions depend on the authenticated account's actual roles and school/classroom assignments. Selecting a view does not grant permissions.
- Teachers belong to one school. Students may belong to multiple schools.
- A classroom is a school's group of students, independent of an individual course or lesson. For example, Mr. George's ten students at ABC School form a classroom.
- A classroom may have multiple assigned teachers. All assigned teachers have equal access to that classroom.
- A student may belong to only one classroom within each school.
- School administrators manage classrooms, teacher assignments and student placement or transfers between classrooms.
- Every school must retain at least one school administrator.

## Roles

### Platform administrator

- Has access to all schools' records and oversees the platform.
- Creates schools and onboards their initial school administrator.
- Creates new courses, adds lessons in draft, and publishes complete programs (added in the deck review).
- Can add students.
- Can remove students from schools.
- Is the only role allowed to remove a school administrator or revoke their administrator role, including demotion to teacher.
- Cannot remove or demote the final school administrator without ensuring that the school retains an administrator.
- Can archive a school using a soft delete. The database must retain the school record and its associated history; students retain their accounts and personal course progress.
- May also serve as a school administrator and teacher. Platform-level and school-level roles can coexist on one account.

### School administrator

- Also acts as a teacher.
- Can see all students, classrooms and records within their own school, subject to the reflection-sharing rules below.
- Can add teachers and students to their school through invitations.
- Can promote other teachers in their school to school administrator.
- Cannot remove or demote another school administrator; that requires the platform administrator.
- Can remove teachers from their school.
- Can remove students from their school.
- Creates and manages classrooms, assigns teachers, and places or moves students between classrooms.
- Controls the school's optional staff access to student reflections.

### Teacher

- Belongs to one school.
- Can see students, attendance where applicable, and course progress only within their assigned classroom or classrooms, except for Amigos que evolucionan as described below.
- Shares equal classroom access with every other teacher assigned to the same classroom.
- Can add students to their own classroom through invitations.
- Can remove their own students from the school. The student's account, personal progress and Amigos membership remain intact.
- Cannot create classrooms, assign teachers or move students between classrooms; those actions belong to school administrators.
- Can read reflections only when the school's sharing setting and the student's classroom assignment authorize access.

### Student

- Can belong to multiple schools, with at most one classroom per school.
- Can see only their own information, course progress, work and attendance records.
- Must never see other members or a member directory.
- Cannot leave a school themselves. Authorized staff manage school membership removal.
- Keeps their account, password and personal course progress when joining another school or being removed from one.
- Always remains a member of Amigos que evolucionan.

## Amigos que evolucionan

- Is treated as its own school.
- Everyone automatically belongs to it, including people who also belong to another school or hold staff roles.
- A person signing up without another school assignment belongs to Amigos que evolucionan by default.
- Its membership can coexist with all other school memberships. It does not prevent a teacher from serving at their assigned school.
- It has no classroom structure: members belong directly to the school.
- All teachers authorized within Amigos que evolucionan can see all its members. Students still see only their own information.
- Attendance is available only in Amigos que evolucionan. Other schools do not need attendance functionality.

## Attendance versus online participation

These are separate records and must not be combined into one measure.

| Measure | Meaning | Recorded by |
| --- | --- | --- |
| In-person attendance | Presence at an Amigos que evolucionan meeting | An authorized teacher |
| Online participation / progress | Completion of a course lesson online | The student's lesson-completion flow |

- Opening a course or lesson does not count as completed online participation.
- Online participation advances when the student finishes each lesson.
- Students can complete the material online even if they did not attend in person.
- The same material is used across schools, so personal course progress follows the student across school memberships. Do not create separate progress for each school.
- Progress is informational and does not require staff grading, checking or approval.
- Recording attendance does not complete online lessons, and online completion does not create an attendance mark.
- Courses retain sequential access: completing a lesson unlocks the next one, while completed lessons remain available for review.

## Reflection visibility

- Written reflections are private to the student unless staff sharing is enabled for a school.
- The school administrator manages a school-level setting equivalent to **Allow staff to read student reflections**.
- When sharing is disabled, only the student can read their reflections through that school's sharing mechanism.
- When sharing is enabled, assigned classroom teachers and school administrators may read eligible reflections. In Amigos que evolucionan, its school-wide teacher visibility replaces classroom scope.
- Enabling sharing is not retroactive. Staff may see only reflections submitted after the school's sharing setting was enabled; earlier reflections remain private.
- A school enabling sharing does not grant staff from another school access.
- Reflection visibility and informational completion counts are separate permissions.

The platform administrator's agreed platform-wide record access remains distinct from school staff sharing permissions. Exact reflection edit/resubmission behavior and disable/re-enable cutoff handling were not specified in the interview; preserve the non-retroactive rule rather than assuming older submissions become shareable.

## Invitations and onboarding

- Use invitations delivered to users' email addresses.
- A user must accept the invitation before joining the invited school or taking on the invited school role.
- Amigos membership is automatic and does not require a school invitation.
- The platform administrator creates a school and invites its first school administrator.
- School administrators invite teachers and students to their own school.
- Teachers can invite their own students.
- Platform administrators can add students through the invitation flow.
- If an invited person already has an account, preserve that account, password and course progress.
- The earlier proposal to provision accounts with temporary passwords and force a first-login password change was withdrawn. It is not part of the agreed onboarding flow.

## Membership removal and record retention

| Action | Authorized roles | Required outcome |
| --- | --- | --- |
| Remove a student from a school | Their own teacher, the school administrator, or the platform administrator | Remove only the relevant school membership and associated classroom assignment; retain account, personal progress and Amigos membership. |
| Remove a teacher from a school | The school administrator or platform administrator | Revoke that school's teaching access; do not treat removal as deletion of the person's account. |
| Remove or demote a school administrator | Platform administrator only | The school must still have at least one school administrator. |
| Archive a school | Platform administrator | Soft delete only; retain the school record and historical records in the database, and preserve students' personal progress. |

Students cannot remove themselves from a school. Ordinary removal must not remove the permanent Amigos membership.

## Visibility summary

| Role | Scope |
| --- | --- |
| Platform administrator | All schools' records. |
| School administrator | Their entire school, with school staff reflection access governed by the sharing setting and submission cutoff. |
| Teacher at an ordinary school | Their assigned classrooms; co-teachers have equal access. |
| Teacher at Amigos que evolucionan | All members of Amigos, with reflection sharing governed by that school's setting and submission cutoff. |
| Student | Their own records only; no visibility into other members. |

## Implementation follow-up

The existing preview was built before this interview and must be updated to match these decisions. In particular, school administrator roles, classroom-scoped teacher access, school-admin continuity, email invitation acceptance, Amigos-only attendance, non-retroactive reflection sharing, and the revised membership-removal rules require reconciliation with existing application and database behavior.

This requirements document is the record of the agreed model, not evidence that those follow-up changes or production migrations have been completed.

## Implementation record — October 22, 2026

The repository now contains the local implementation and PostgreSQL tests for these roles. See [role infrastructure](docs/course-portal/ROLES_INFRASTRUCTURE.md) for coverage, conservative reflection rules, email configuration, and activation prerequisites. This is not a statement that migrations have been applied to shared QA or production.
