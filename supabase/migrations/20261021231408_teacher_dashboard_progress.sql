begin;
-- Only completion counts are disclosed. Reflections and lesson work remain private.
create function education_qa_private.teacher_dashboard(p_school uuid,p_query text default '',p_limit integer default 25,p_offset integer default 0)
returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid := education_qa_private.actor(); result jsonb; school_name text;
begin
 if p_school is null or not(education_qa_private.teaches(p_school) or education_qa_private.is_admin()) then raise insufficient_privilege; end if;
 select name into school_name from education_qa_private.schools where id=p_school and status='active';
 if school_name is null then raise insufficient_privilege; end if;
 if p_query is null or length(p_query)>200 or p_limit is null or p_limit not between 1 and 100 or p_offset is null or p_offset not between 0 and 100000 then raise invalid_parameter_value; end if;
 with active_students as (
  select user_id,display_name,email from education_qa_private.memberships where school_id=p_school and role='student' and status='active'
 ), matching as (
  select * from active_students where p_query='' or position(lower(btrim(p_query)) in lower(coalesce(display_name,'')||' '||coalesce(email,'')))>0
 ), page as (
  select * from matching order by lower(coalesce(display_name,email,'')),user_id limit p_limit offset p_offset
 ), rows as (
  select m.user_id as "userId",m.display_name as "displayName",m.email,
   (select count(*) from education_qa_private.attendance a where a.school_id=p_school and a.user_id=m.user_id and a.status='present') as "attendedSessions",
   (select count(*) from education_qa_private.attendance a where a.school_id=p_school and a.user_id=m.user_id and a.status='absent') as "absentSessions",
   (select coalesce(jsonb_agg(jsonb_build_object('courseId',c.id,'total',c.lesson_count,'completed',coalesce(p.completed,0)) order by c.id),'[]'::jsonb)
    from learning_private.courses c left join learning_private.progress p on p.course_id=c.id and p.user_id=m.user_id) as courses
  from page m
 )
 select jsonb_build_object('schoolId',p_school,'schoolName',school_name,
  'studentCount',(select count(*) from active_students),'matchedCount',(select count(*) from matching),
  'completedLessons',(select coalesce(sum(p.completed),0) from learning_private.progress p join active_students s on s.user_id=p.user_id),
  'finishedCourses',(select count(*) from learning_private.progress p join active_students s on s.user_id=p.user_id join learning_private.courses c on c.id=p.course_id where p.completed=c.lesson_count),
  'attendedSessions',(select count(*) from education_qa_private.attendance a join active_students s on s.user_id=a.user_id where a.school_id=p_school and a.status='present'),
  'students',coalesce((select jsonb_agg(to_jsonb(r) order by lower(coalesce(r."displayName",r.email,'')),r."userId") from rows r),'[]'::jsonb)) into result;
 return result;
end $$;
revoke all on function education_qa_private.teacher_dashboard(uuid,text,integer,integer) from public,anon,authenticated;
grant execute on function education_qa_private.teacher_dashboard(uuid,text,integer,integer) to authenticated;
create function public.portal_teacher_dashboard(p_school uuid,p_query text default '',p_limit integer default 25,p_offset integer default 0)
returns jsonb language sql security invoker set search_path='' as $$ select education_qa_private.teacher_dashboard(p_school,p_query,p_limit,p_offset) $$;
revoke all on function public.portal_teacher_dashboard(uuid,text,integer,integer) from public,anon;
grant execute on function public.portal_teacher_dashboard(uuid,text,integer,integer) to authenticated;
commit;
