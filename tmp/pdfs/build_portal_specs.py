from pathlib import Path
import json, html
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image, KeepTogether
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.utils import ImageReader

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'output/pdf/Humanismo_Evolutivo_Educational_Portal_Specifications.pdf'
for name,file in [('Body','humanismo-8.ttf'),('Bold','humanismo-11.ttf'),('Display','humanismo-6.ttf')]:
 pdfmetrics.registerFont(TTFont(name,str(ROOT/'public/fonts'/file)))
pdfmetrics.registerFontFamily('Body',normal='Body',bold='Bold',italic='Body',boldItalic='Bold')
GREEN=colors.HexColor('#173F2C'); GOLD=colors.HexColor('#B79035'); CREAM=colors.HexColor('#F8F6ED'); PALE=colors.HexColor('#EAF0E1'); INK=colors.HexColor('#31483B'); LINE=colors.HexColor('#DCE5D2'); MUTED=colors.HexColor('#58675C')
W,H=595.276,841.89; CW=W-88
styles={
 'eyebrow':ParagraphStyle('eyebrow',fontName='Bold',fontSize=9,leading=12,textColor=GOLD,spaceAfter=10),
 'title':ParagraphStyle('title',fontName='Display',fontSize=33,leading=36,textColor=GREEN,spaceAfter=15),
 'h2':ParagraphStyle('h2',fontName='Display',fontSize=21,leading=25,textColor=GREEN,spaceBefore=14,spaceAfter=8,keepWithNext=True),
 'body':ParagraphStyle('body',fontName='Body',fontSize=10.5,leading=14.4,textColor=INK,spaceAfter=8),
 'small':ParagraphStyle('small',fontName='Body',fontSize=8.5,leading=11.2,textColor=MUTED,spaceAfter=7),
 'cell':ParagraphStyle('cell',fontName='Body',fontSize=9.1,leading=12.1,textColor=INK),
 'th':ParagraphStyle('th',fontName='Bold',fontSize=9.1,leading=12.1,textColor=colors.white),
 'bullet':ParagraphStyle('bullet',fontName='Body',fontSize=10.3,leading=14.1,textColor=INK,leftIndent=12,firstLineIndent=-10,spaceAfter=6),
 'appendix':ParagraphStyle('appendix',fontName='Body',fontSize=9.2,leading=12.3,textColor=INK,spaceAfter=5),
}
story=[]
sections=[]
def P(s,kind='body'):return Paragraph(s,styles[kind] if isinstance(kind,str) else kind)
def para(s):story.append(P(s))
def bullet(s):story.append(P('• '+s,'bullet'))
def title(number,name,sub=None):
 if story:story.append(PageBreak())
 sections.append((number,name))
 story.extend([P(f'{number} / FUNCTIONAL SPECIFICATION','eyebrow'),P(name,'title')])
 if sub:para(sub)
def h(s):story.append(P(s,'h2'))
def box(s):
 t=Table([[P(s)]],colWidths=[CW]);t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),PALE),('BOX',(0,0),(-1,-1),.6,LINE),('LEFTPADDING',(0,0),(-1,-1),14),('RIGHTPADDING',(0,0),(-1,-1),14),('TOPPADDING',(0,0),(-1,-1),12),('BOTTOMPADDING',(0,0),(-1,-1),8)]));story.extend([t,Spacer(1,10)])
def table(headers,rows,widths=None):
 data=[[P(html.escape(str(c)),'th') for c in headers]]+[[P(str(c),'cell') for c in row] for row in rows]
 t=Table(data,colWidths=widths or [CW/len(headers)]*len(headers),repeatRows=1,hAlign='LEFT')
 t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),GREEN),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,CREAM]),('VALIGN',(0,0),(-1,-1),'TOP'),('LINEBELOW',(0,0),(-1,0),.5,GREEN),('LINEBELOW',(0,1),(-1,-1),.4,LINE),('LEFTPADDING',(0,0),(-1,-1),10),('RIGHTPADDING',(0,0),(-1,-1),10),('TOPPADDING',(0,0),(-1,-1),9),('BOTTOMPADDING',(0,0),(-1,-1),9)]))
 story.extend([t,Spacer(1,10)])
def shot(file,caption,maxh=260):
 path=ROOT/'docs/course-portal/screenshots'/file
 iw,ih=ImageReader(str(path)).getSize();scale=min(CW/iw,maxh/ih)
 im=Image(str(path),width=iw*scale,height=ih*scale);im.hAlign='LEFT'
 story.extend([im,Spacer(1,7),P(caption,'small')])

# Cover
story.extend([Spacer(1,82),P('HUMANISMO EVOLUTIVO TRANSPERSONAL','eyebrow'),P('Educational<br/>Portal','title'),P('Functional &amp; Access<br/>Specifications',ParagraphStyle('coverSub',fontName='Display',fontSize=28,leading=32,textColor=GREEN,spaceAfter=25))])
para('A client presentation reference covering the student experience, course structure, teaching tools and agreed school permissions.')
story.append(Spacer(1,28))
table(['4 initial courses','146 lesson pages','4 cumulative roles'],[['Independent learning paths','Sequential access and saved work','Student, teacher, school and platform administration']])
story.append(Spacer(1,30))
box('<b>Document purpose</b><br/>This is the consolidated product specification, not a statement of production readiness. It distinguishes the working prototype from requirements approved in the October 22 roles interview.')
para('Version 1.0 • October 22, 2026')
story.append(P('Prepared for client presentation planning. Product interface labels remain in Spanish; explanations are in English.','small'))

# 1
title('01','Product overview','A private learning portal that combines independent study with school-based support.')
h('One learning record, multiple communities')
para('Students access the same course material wherever they study. Their personal course progress follows their account across schools. School membership determines who may support them, not whether their learning history is retained.')
table(['Audience','Primary experience'],[
 ['Student','Personal dashboard, courses, lesson work, library and scheduled sessions.'],
 ['Teacher','Classroom student roster, informational course progress and authorized attendance tools.'],
 ['School administrator','School-wide visibility, teachers, classrooms, student placement and sharing settings.'],
 ['Platform administrator','School creation, initial school administrator onboarding, oversight and school archiving.']],[112,CW-112])
h('Initial course offering')
cat=json.loads((ROOT/'src/generated/course-catalog.json').read_text())
table(['Course','Lessons','Session plan'],[[html.escape(c['title']),len(c['lessons']),f"{c['minutes']} minutes per lesson"] for c in cat],[CW-174,55,119])
para('<b>Total:</b> 146 lessons and 157 hours of planned session content. These hours describe the supplied curriculum, not measured attendance or tracked time on site.')
box('<b>Delivery baseline</b><br/>A working local prototype exists. Classroom-scoped access, school-administrator governance and several interview requirements still need implementation and release validation.')

# 2
title('02','Student experience','The student landing page is <b>Mi aprendizaje</b>. Students never see other members or a member directory.')
shot('student-dashboard.png','Prototype screen with local test data. Counts illustrate the interface, not client usage.',240)
table(['Dashboard item','Definition'],[
 ['In-person attendance','Attendance marks recorded by authorized teachers; target scope is Amigos que evolucionan only.'],
 ['Courses with attendance','Distinct courses with at least one recorded in-person attendance.'],
 ['Completed online lessons','Lessons finished through the online completion flow. Opening a lesson is not completion.'],
 ['Courses with online participation','Courses with at least one completed lesson; completed-course totals are shown separately.']],[156,CW-156])
para('Each course card displays its title, completion status, completed/total lessons, percentage progress, eligible attendance count and a begin, continue or review action. Missing data is shown as unavailable rather than as a fabricated zero.')

# 3
title('03','Courses & lesson workspaces','Every course has its own program page. Every lesson has its own page and private work area.')
table(['Lesson section','Content'],[
 ['Class facts','Book, subject, source sections, duration and prerequisites.'],
 ['Summary','Orientation to the lesson and the argument it develops.'],
 ['Learning objectives','Capabilities the student should develop.'],
 ['Key concepts','Terms and definitions from the supplied program.'],
 ['Session development','The full supplied timed session plan and activities.'],
 ['Reflection questions','Prompts for personal understanding and application.'],
 ['Reading assignment','Preparatory reading or closing reading.'],
 ['My work','A saved reflection/exercise field plus a review confirmation.']],[140,CW-140])
h('Current prototype completion rule')
para('The student confirms they reviewed the contents and exercises and saves a reflection of at least 20 characters. The field accepts up to 20,000 characters. A draft can be saved and resumed without completing the lesson.')
para('Completion is self-attested and informational. It does not require a teacher grade, staff approval or proof that the planned session duration elapsed. The interview confirms progress is informational; the precise writing-length rule is a prototype behavior.')
box('<b>Content fidelity</b><br/>All 146 lesson titles and lesson plans come from the four supplied course PDFs. No missing video, assessment or grading workflow is represented as available. The full lesson-title index appears in Appendix A.')

# 4
title('04','Progression & student journeys')
h('Sequential access')
table(['Step','Expected behavior'],[
 ['Start a course','Lesson 1 is available. Later lessons remain locked.'],
 ['Save work','Save a draft without changing the unlocked lesson boundary.'],
 ['Complete lesson N','Persist completion and unlock lesson N+1 in that course.'],
 ['Return to earlier material','All completed lessons remain available to read and revisit.'],
 ['Try a future lesson URL','Server and database checks withhold locked content.'],
 ['Re-complete a prior lesson','Do not reduce progress or count the same lesson twice.'],
 ['Study another course','Maintain an independent progression boundary for that course.']],[145,CW-145])
h('School changes do not reset learning')
para('An existing student joining another school keeps the same account, password and course progress. Progress is global for the same material; a school must not create a duplicate progress record. Removing a school membership also preserves that learning record.')
h('Worked example')
box('A student completes lessons 1, 2 and 3 in Yo Soy Nosotros. They can revisit all three and continue to lesson 4. Lesson 5 stays locked until lesson 4 is finished. Joining ABC School does not make them repeat lessons 1-3. None of those online actions creates an in-person attendance mark.')
para('If saving fails, show an error and keep the next lesson locked. If progress cannot be verified, do not infer authorization from a local counter or a URL parameter.')

# 5
title('05','Teacher dashboard','The teacher landing page is <b>Mi escuela</b>, with the school name visible in the sidebar and school banner.')
shot('teacher-dashboard.png','Working teacher prototype using a local school and test account. Final visibility must be narrowed to assigned classrooms.',245)
h('Tools and information')
for s in ['School summary: active students, attendance records where permitted, completed online lessons and completed courses.','Searchable roster by student name or email; current prototype page size is 25 students.','Course selector for displayed progress and individual detail cards for each course, including completed lessons, total lessons and percentage.','Direct attendance management action where authorized; refresh, loading, no-results and retry states.']:
 bullet(s)
box('<b>Important distinction</b><br/>The prototype report currently works at school scope. The approved model restricts ordinary teachers to their assigned classrooms, gives school administrators school-wide visibility, and limits attendance to Amigos que evolucionan. Those access changes are pending.')

# 6
title('06','Role definitions','Roles are cumulative. One person may hold platform, school-administration, teacher and student roles simultaneously.')
table(['Role','Visibility and authority'],[
 ['Platform administrator','Access all schools\' records; create schools; onboard the first school administrator; add/remove students; remove or demote school administrators; archive schools with record retention.'],
 ['School administrator','Also acts as a teacher. See the entire school; invite teachers/students; promote teachers to school administrator; manage classrooms and assignments; remove teachers/students; manage reflection sharing.'],
 ['Teacher','Serve one school; see assigned classrooms; share equal access with co-teachers; invite and remove own students. No classroom creation, teacher assignment or student transfers.'],
 ['Student','See own account, progress, work and attendance only. Join multiple schools, with at most one classroom per school. Cannot leave a school themselves.']],[132,CW-132])
h('Administrator continuity')
para('Every school must retain at least one school administrator. Only the platform administrator may remove or demote a school administrator. A school administrator can promote another teacher to administrator but cannot revoke an administrator role.')
h('Permission checks')
para('Access is determined by authenticated roles and school/classroom assignments. Changing a navigation view or role-preview query must never grant access. A teacher whose assignment or membership becomes inactive must lose the corresponding access.')

# 7
title('07','Schools, classrooms & Amigos')
table(['Ordinary school','Amigos que evolucionan'],[
 ['Has classrooms: each is a group of students independent of a course or lesson.','Is a school with no classroom structure. Members belong directly to the school.'],
 ['A student belongs to no more than one classroom within that school.','Everyone belongs automatically, including staff and people in other schools.'],
 ['Multiple teachers may share a classroom with equal access.','All authorized Amigos teachers can see all its members.'],
 ['School administrators create classrooms and assign teachers and students.','Its membership can coexist with all other schools; students still see only their own information.'],
 ['Teachers have classroom-scoped visibility.','Attendance is available here only.'],
 ['Students may also belong to other schools.','It is the permanent default school for people signing up without another school assignment.']],[CW/2,CW/2])
h('Example school arrangement')
para('ABC School has a classroom containing Mr. George\'s ten students. Another teacher may be assigned to the same classroom, with equal access. A student may also belong to a classroom at another school, and remains a member of Amigos throughout.')
box('<b>Governance boundary</b><br/>School administrators control classroom creation, teacher assignment and student placement or transfer. Teachers can add their own students but do not gain authority to move students between classrooms.')
para('A teacher serves one school. Automatic Amigos membership is compatible with that rule and does not itself grant teaching authority in Amigos.')

# 8
title('08','Invitations & membership lifecycle')
h('Onboarding flow')
table(['Stage','Required behavior'],[
 ['School setup','Platform administrator creates the school and invites its first school administrator.'],
 ['Staff onboarding','School administrator invites teachers by email. Roles apply after invitation acceptance.'],
 ['Student onboarding','Platform/school administrators and authorized teachers invite students within their scope.'],
 ['Acceptance','A person must accept before joining the invited school or assuming its invited role.'],
 ['Existing account','Reuse the account and preserve its password and course progress.'],
 ['Independent signup','Automatically join Amigos; no separate Amigos invitation is required.']],[125,CW-125])
para('Email invitations replace the withdrawn proposal for temporary-password account provisioning and forced first-login password changes.')
h('Removal rules')
for s in ['A student cannot leave a school themselves. Their own teacher, school administrator or platform administrator may remove the relevant school membership.','Student removal retains the account, personal course progress and Amigos membership, and removes the associated classroom assignment.','School administrators can remove teachers from their school. Platform administrators retain platform oversight.','Only the platform administrator can remove or demote a school administrator, while preserving at least one administrator for the school.']:
 bullet(s)

# 9
title('09','Attendance & online participation','Attendance and progress are separate measures with different sources of authority.')
table(['','In-person attendance','Online progress'],[
 ['Meaning','Presence at an Amigos meeting.','Completion of the same course material online.'],
 ['Recorded by','Authorized teacher.','Student lesson-completion flow.'],
 ['Scope','Amigos que evolucionan only.','Personal record that follows the student across schools.'],
 ['Approval','Teacher records the meeting status.','No grading or staff approval needed.'],
 ['Effect on the other record','Does not complete or unlock lessons.','Does not mark a meeting attended.']],[76,(CW-76)/2,(CW-76)/2])
h('Attendance handling in the prototype')
para('Teachers can mark present or absent for a scheduled session, correct a prior mark, and receive a save confirmation. Duplicate marks update the record rather than inflating counts. Unmarked sessions are not treated as absences. Changes are auditable.')
para('The current prototype supports school-scoped attendance. Restricting the feature to Amigos, as agreed in the interview, remains implementation work. Ordinary schools must not be presented as requiring attendance.')
h('Dashboard interpretation')
para('Student online completion percentage is completed lessons divided by total lessons in that course. Courses with participation have at least one completed lesson. Teacher roster progress across courses uses summed completed lessons divided by summed available lessons, not an unweighted average of course percentages.')
box('A student who misses an in-person meeting can still complete the corresponding learning material online. Their participation advances, while the meeting attendance record remains unchanged.')

# 10
title('10','Reflections & privacy')
h('School-controlled staff sharing')
para('Reflections are private to the student unless a school administrator enables the school setting <b>Allow staff to read student reflections</b>. This permission is separate from visibility of informational completion counts.')
table(['Setting / condition','School staff access'],[
 ['Sharing disabled','Only the student can read their reflections through that school\'s sharing mechanism.'],
 ['Sharing enabled','Assigned classroom teachers and school administrators can read eligible submissions.'],
 ['Submitted before enablement','Remain private; enabling sharing is not retroactive.'],
 ['Submitted after enablement','Eligible for authorized staff access within the school.'],
 ['Amigos teacher scope','Amigos has no classrooms; its authorized teachers have school-wide scope, subject to its sharing setting and cutoff.'],
 ['Different school','One school\'s sharing setting does not authorize staff from another school.']],[155,CW-155])
h('Timing example')
box('T1: a student submits a reflection while sharing is off.<br/>T2: the school administrator enables sharing.<br/>T3: the student submits another reflection.<br/><br/>The T1 reflection stays private. Authorized staff may read the T3 reflection. Completion counts remain separate from this sharing rule.')
para('The platform administrator\'s agreed platform-wide record access is distinct from school staff sharing. The interview did not define edit/resubmission behavior or repeated disable/re-enable cutoffs; those cases require a decision before implementation.')
para('<b>Prototype status:</b> written work is currently owner-only. The school setting and non-retroactive staff-sharing workflow are agreed requirements, not delivered capabilities.')

# 11
title('11','Calendar & learning library')
shot('schedule-list.png','Prototype schedule list: course names are grouped once, with dated sessions beneath them.',240)
h('Calendario: searchable list')
para('Replace the monthly grid with a list grouped by course. Students and staff can search by course, date or location, combine search with a course selector, clear filters, inspect result counts and open a session detail page. Empty results offer a clear reset action.')
para('The supplied schedule contains 23 dated sessions across 10 scheduled course titles for February 15-20, 2027. This broader school schedule is distinct from the four online courses. No additional recurrence is inferred. Unknown venues or timezones remain marked unconfirmed; floating times preserve the source\'s wall-clock time.')
h('Biblioteca')
para('Categories include books, podcasts and videos, articles and resources, and Las 51 preguntas. Material detail pages provide the available reader or media experience. Published course links lead to the program without bypassing lesson locks.')

# 12
title('12','Design, security & retention')
h('Visual and interaction design')
para('Keep the established Humanismo Evolutivo design: forest green navigation, warm cream backgrounds, soft green panels, restrained gold accents, rounded cards, serif headings and Source Sans body text. Preserve Spanish navigation labels and clear role-specific landing pages.')
para('Retain responsive layouts, labeled controls, keyboard focus indicators, readable progress values, accessible expansion states and explicit loading, empty, error and save-confirmation feedback. The prototype has been reviewed on desktop; earlier course-reader checks also covered a 390px mobile viewport.')
h('Authorization and personal data')
for s in ['Require an authenticated non-anonymous account and verify the role and membership scope on the server and in the database.','Withhold locked lesson text until access is verified. Do not ship all lesson bodies as an unrestricted public asset.','Apply database row-level security and restricted, validated operations to progress, school records and private work.','Do not expose one school\'s students to another school\'s teachers. Final ordinary-teacher scope is assigned classrooms.','Do not let students view member lists or self-record attendance. Do not infer permission from preview role selections.']:
 bullet(s)
h('Retention')
para('School archiving is a soft delete: retain the school record and associated history. Membership removal revokes relevant access without deleting the student account or personal learning progress. Amigos membership remains. School-administrator continuity must be enforced during role changes.')
para('The interview did not set a retention duration, data-export policy or account-deletion process. Those are not represented as approved specifications.')

# 13
title('13','Delivery status & remaining work','Status reflects the repository and local prototype, not a production deployment.')
table(['Area','Current state'],[
 ['Course catalog and lesson pages','Built in prototype: 4 courses, 146 lessons, saved work and sequential locking.'],
 ['Student dashboard','Built in prototype: attendance and online progress shown separately.'],
 ['Teacher landing and progress report','Built in prototype: automatic teacher landing, school name, searchable paginated roster and student progress. Classroom scope is pending.'],
 ['Attendance tools','Built in prototype with school scope. Amigos-only restriction is pending.'],
 ['Calendar list and library','Built in prototype with search, course filter and material detail views.'],
 ['School administrator role','Agreed; role implementation and governance need reconciliation.'],
 ['Classrooms and co-teachers','Agreed; classroom model and classroom-scoped access need implementation.'],
 ['Email invitation delivery','Acceptance/membership foundation exists; agreed email onboarding requires reconciliation and end-to-end delivery validation.'],
 ['Reflection sharing','Owner-only work exists; school setting and submission-time cutoff are pending.'],
 ['Removal / administrator continuity','Existing membership tools require updates to prohibit student self-leaving, preserve final administrators and match agreed authority.'],
 ['Release','Remote migrations, QA validation and production release remain required.']],[154,CW-154])
para('Recorded validation for the latest feature work: 50 automated tests, TypeScript, focused ESLint and a webpack production build passed. Browser checks covered progress, attendance, teacher landing, school naming, search, course filtering and private-work exclusion. These checks do not certify the pending interview requirements as implemented.')

# 14
title('14','Acceptance checklist & references')
h('Acceptance scenarios for the agreed product')
for s in ['A new independent account automatically belongs to Amigos; students never see a member directory.','Accepting an emailed school invitation adds the authorized membership without resetting password or progress.','A teacher lands on the school dashboard; co-teachers see the same assigned classroom students and no unrelated classrooms.','A school administrator sees the whole school, manages classrooms and sharing settings, and cannot demote another administrator.','The platform administrator cannot leave a school without an administrator and can archive it without deleting records.','Completing a lesson unlocks only the next lesson in that course. Earlier completed lessons stay available across school changes.','Only Amigos supports attendance. Online completion and attendance never overwrite or substitute for each other.','Enabling reflection sharing exposes only eligible later submissions to authorized staff, never earlier work.','Removing a student revokes that school/classroom access while preserving their account, progress and Amigos membership.']:
 bullet(s)
h('Items still needing a product decision')
para('Reflection edits/resubmissions and sharing disable/re-enable timing; detailed retention/export/account-deletion policies; and any additional content, assessment or certification scope not covered by the supplied programs or interview.')
h('Source of truth and traceability')
para('Approved role and visibility rules: <b>ROLES.md</b> (October 22 interview). Prototype behavior and recorded verification: <b>docs/course-portal/README.md</b>, the portal components, API handlers and database migrations. Curriculum: <b>src/generated/course-catalog.json</b> and the four supplied program PDFs.')
para('Repository baseline: commit <b>228a9d8</b>. Review branch: <b>feature/portal-course-paths</b>. Pull request: <link href="https://github.com/herzenco/Humanismo_Evolutivo/pull/40" color="#173F2C">github.com/herzenco/Humanismo_Evolutivo/pull/40</link>.')
story.append(P('Images are local prototype screenshots using test accounts. This document contains no production credentials or real student records.','small'))

# Appendix: all 146 titles, two pages per long course, one for short.
for c in cat:
 lessons=c['lessons'];chunks=[lessons[i:i+23] for i in range(0,len(lessons),23)]
 for index,chunk in enumerate(chunks):
  title('A', 'Complete lesson index', 'Appendix A / '+html.escape(c['title']))
  story.append(P(f"{len(lessons)} lessons • {c['minutes']} minutes per planned session • Lessons {chunk[0]['id']}-{chunk[-1]['id']}",'small'))
  for l in chunk:
   story.append(P(f"<b>{l['id'].zfill(2)}</b>  {html.escape(l['title'])}",'appendix'))
  if len(lessons)==11:
   story.append(Spacer(1,18));box('This appendix lists the complete 146-lesson opening curriculum. The portal contains the full lesson plans; this client specification is not a replacement for the teaching manuals.')

class NumberedCanvas(canvas.Canvas):
 def __init__(self,*a,**kw):super().__init__(*a,**kw);self.states=[]
 def showPage(self):self.states.append(dict(self.__dict__));self._startPage()
 def save(self):
  count=len(self.states)
  for state in self.states:
   self.__dict__.update(state);self.decorate(count);super().showPage()
  super().save()
 def decorate(self,count):
  self.saveState();self.setStrokeColor(LINE);self.setLineWidth(.6);self.line(44,43,W-44,43)
  self.setFont('Body',8);self.setFillColor(MUTED);self.drawString(44,29,'Humanismo Evolutivo | Educational portal specifications');self.drawRightString(W-44,29,f'{self._pageNumber:02d} / {count:02d}')
  if self._pageNumber>1:
   self.setFont('Bold',8);self.setFillColor(GREEN);self.drawString(44,H-31,'HUMANISMO EVOLUTIVO');self.setFont('Body',8);self.setFillColor(MUTED);self.drawRightString(W-44,H-31,'CLIENT REFERENCE • OCTOBER 2026')
  else:
   self.setFillColor(GREEN);self.rect(0,H-18,W,18,fill=1,stroke=0)
  self.restoreState()

doc=SimpleDocTemplate(str(OUT),pagesize=(W,H),leftMargin=44,rightMargin=44,topMargin=57,bottomMargin=59,title='Humanismo Evolutivo - Educational Portal Specifications',author='Humanismo Evolutivo',subject='Functional specification and agreed roles, permissions and school model')
doc.build(story,canvasmaker=NumberedCanvas)
print(OUT)
