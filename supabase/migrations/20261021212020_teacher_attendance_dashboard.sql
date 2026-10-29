begin;
create table education_qa_private.scheduled_sessions (
 id text primary key, course_id text not null, title text not null, starts_at timestamp not null
);
-- Attendance is independent of lesson completion and never unlocks online lessons.
create table education_qa_private.attendance (
 school_id uuid not null references education_qa_private.schools(id) on delete restrict,
 session_id text not null references education_qa_private.scheduled_sessions(id) on delete restrict,
 user_id uuid not null references auth.users(id) on delete restrict,
 status text not null check(status in ('present','absent')),
 recorded_by uuid not null references auth.users(id) on delete restrict,
 recorded_at timestamptz not null default now(),
 primary key(school_id,session_id,user_id)
);
create index education_qa_attendance_user on education_qa_private.attendance(user_id,session_id);
create index education_qa_attendance_actor on education_qa_private.attendance(recorded_by);
alter table education_qa_private.scheduled_sessions enable row level security;
alter table education_qa_private.attendance enable row level security;
revoke all on education_qa_private.scheduled_sessions,education_qa_private.attendance from public,anon,authenticated;
insert into education_qa_private.scheduled_sessions(id,course_id,title,starts_at) values
('2027-02-15-identidad-y-civismo','identidad-y-civismo','Identidad y Civismo','2027-02-15T11:00:00'),
('2027-02-15-ecologia-y-espiritualidad','ecologia-y-espiritualidad','Ecología y Espiritualidad','2027-02-15T16:00:00'),
('2027-02-15-historia-evolutiva-del-arte','historia-evolutiva-del-arte','Historia Evolutiva del Arte','2027-02-15T17:00:00'),
('2027-02-15-humanismo-evolutivo-transpersonal','humanismo-evolutivo-transpersonal','Humanismo Evolutivo Transpersonal','2027-02-15T18:00:00'),
('2027-02-16-identidad-y-civismo','identidad-y-civismo','Identidad y Civismo','2027-02-16T11:00:00'),
('2027-02-16-introduccion-a-la-filosofia','introduccion-a-la-filosofia','Introducción a la Filosofía','2027-02-16T16:00:00'),
('2027-02-16-filosofia-de-yo-soy-nosotros','filosofia-de-yo-soy-nosotros','Filosofía de “Yo Soy Nosotros”','2027-02-16T17:00:00'),
('2027-02-16-introduccion-a-la-antropologia','introduccion-a-la-antropologia','Introducción a la Antropología','2027-02-16T18:00:00'),
('2027-02-17-identidad-y-civismo','identidad-y-civismo','Identidad y Civismo','2027-02-17T11:00:00'),
('2027-02-17-ecologia-y-espiritualidad','ecologia-y-espiritualidad','Ecología y Espiritualidad','2027-02-17T16:00:00'),
('2027-02-17-historia-evolutiva-del-arte','historia-evolutiva-del-arte','Historia Evolutiva del Arte','2027-02-17T17:00:00'),
('2027-02-17-humanismo-evolutivo-transpersonal','humanismo-evolutivo-transpersonal','Humanismo Evolutivo Transpersonal','2027-02-17T18:00:00'),
('2027-02-18-identidad-y-civismo','identidad-y-civismo','Identidad y Civismo','2027-02-18T11:00:00'),
('2027-02-18-introduccion-a-la-filosofia','introduccion-a-la-filosofia','Introducción a la Filosofía','2027-02-18T16:00:00'),
('2027-02-18-filosofia-de-yo-soy-nosotros','filosofia-de-yo-soy-nosotros','Filosofía de “Yo Soy Nosotros”','2027-02-18T17:00:00'),
('2027-02-18-introduccion-a-la-antropologia','introduccion-a-la-antropologia','Introducción a la Antropología','2027-02-18T18:00:00'),
('2027-02-19-identidad-y-civismo','identidad-y-civismo','Identidad y Civismo','2027-02-19T11:00:00'),
('2027-02-19-ecologia-y-espiritualidad','ecologia-y-espiritualidad','Ecología y Espiritualidad','2027-02-19T16:00:00'),
('2027-02-19-historia-evolutiva-del-arte','historia-evolutiva-del-arte','Historia Evolutiva del Arte','2027-02-19T17:00:00'),
('2027-02-19-humanismo-evolutivo-transpersonal','humanismo-evolutivo-transpersonal','Humanismo Evolutivo Transpersonal','2027-02-19T18:00:00'),
('2027-02-20-filosofia-para-ninos','filosofia-para-ninos','Filosofía para Niños','2027-02-20T10:00:00'),
('2027-02-20-el-arte-de-ser-empresario','el-arte-de-ser-empresario','El Arte de Ser Empresario','2027-02-20T11:00:00'),
('2027-02-20-historia-de-las-religiones-lectura-para-ninos','historia-de-las-religiones-lectura-para-ninos','Historia de las Religiones / Lectura para Niños','2027-02-20T11:00:00');
create function education_qa_private.attendance_access(p_action text,p_input jsonb default '{}') returns jsonb
language plpgsql security definer set search_path='' as $$
declare
 actor uuid := education_qa_private.actor(); school uuid; student uuid; session text; result jsonb;
 page_limit integer := greatest(1,least(coalesce((p_input->>'limit')::integer,50),100));
 page_offset integer := greatest(0,coalesce((p_input->>'offset')::integer,0));
begin
 if p_input is null or jsonb_typeof(p_input)<>'object' then raise invalid_parameter_value; end if;
 if p_action='mine' then
  -- Repeated attendance at the same scheduled session across schools counts only once.
  return jsonb_build_object('presentSessions',(select count(distinct session_id) from education_qa_private.attendance where user_id=actor and status='present'),
   'presentCourses',(select count(distinct s.course_id) from education_qa_private.attendance a join education_qa_private.scheduled_sessions s on s.id=a.session_id where a.user_id=actor and a.status='present'),
   'courses',coalesce((select jsonb_agg(to_jsonb(c) order by c.title) from (
    select s.course_id as "courseId",min(s.title) title,count(distinct a.session_id) filter(where a.status='present') present,
     count(distinct a.session_id) filter(where a.status='absent' and not exists(select 1 from education_qa_private.attendance other where other.user_id=actor and other.session_id=a.session_id and other.status='present')) absent
    from education_qa_private.attendance a join education_qa_private.scheduled_sessions s on s.id=a.session_id
    where a.user_id=actor group by s.course_id
   ) c),'[]'::jsonb));
 end if;
 school:=(p_input->>'schoolId')::uuid;
 session:=p_input->>'sessionId';
 if school is null or not(education_qa_private.teaches(school) or education_qa_private.is_admin()) then raise insufficient_privilege; end if;
 if not exists(select 1 from education_qa_private.schools where id=school and status='active') then raise insufficient_privilege; end if;
 if session is null or not exists(select 1 from education_qa_private.scheduled_sessions where id=session) then raise invalid_parameter_value; end if;
 if p_action='roster' then
  select coalesce(jsonb_agg(to_jsonb(r)),'[]') into result from (
   select m.user_id as "userId",m.display_name as "displayName",m.email,a.status,a.recorded_at as "recordedAt"
   from education_qa_private.memberships m left join education_qa_private.attendance a on a.school_id=m.school_id and a.user_id=m.user_id and a.session_id=session
   where m.school_id=school and m.role='student' and m.status='active' order by m.user_id limit page_limit offset page_offset
  ) r;
  return result;
 elsif p_action='mark' then
  student:=(p_input->>'userId')::uuid;
  if p_input->>'status' is null or p_input->>'status' not in ('present','absent') then raise invalid_parameter_value; end if;
  -- Lock membership records so a concurrent removal/suspension cannot race a mark.
  perform 1 from education_qa_private.schools where id=school and status='active' for share;
  if not found then raise insufficient_privilege; end if;
  perform 1 from education_qa_private.memberships where school_id=school and user_id=student and role='student' and status='active' for share;
  if not found then raise insufficient_privilege; end if;
  if not education_qa_private.is_admin() then
   perform 1 from education_qa_private.memberships where school_id=school and user_id=actor and role='teacher' and status='active' for share;
   if not found then raise insufficient_privilege; end if;
  end if;
  insert into education_qa_private.attendance(school_id,session_id,user_id,status,recorded_by)
   values(school,session,student,p_input->>'status',actor)
   on conflict(school_id,session_id,user_id) do update set status=excluded.status,recorded_by=actor,recorded_at=now();
  insert into education_qa_private.audit(actor_id,action,school_id,target_user_id,detail)
   values(actor,'attendance.mark',school,student,jsonb_build_object('sessionId',session,'status',p_input->>'status'));
  return jsonb_build_object('status',p_input->>'status');
 else raise invalid_parameter_value;
 end if;
end $$;
revoke all on function education_qa_private.attendance_access(text,jsonb) from public,anon,authenticated;
grant execute on function education_qa_private.attendance_access(text,jsonb) to authenticated;
create function public.portal_attendance_access(p_action text,p_input jsonb default '{}') returns jsonb
language sql security invoker set search_path='' as $$ select education_qa_private.attendance_access(p_action,p_input) $$;
revoke all on function public.portal_attendance_access(text,jsonb) from public,anon;
grant execute on function public.portal_attendance_access(text,jsonb) to authenticated;
commit;
