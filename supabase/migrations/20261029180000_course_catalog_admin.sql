-- The portal catalog is the database. Platform admins can create, edit,
-- publish, unpublish and archive courses and classes. Direct table writes stay
-- revoked; row security still admits only a platform admin if a grant is added later.
begin;
alter table learning_private.courses drop constraint if exists courses_status_check;
alter table learning_private.courses add constraint courses_status_check check (status in ('draft','published','archived'));
alter table learning_private.lessons add column if not exists archived_at timestamptz;
drop policy if exists platform_admin_all_courses on learning_private.courses;
drop policy if exists platform_admin_all_lessons on learning_private.lessons;
create policy platform_admin_all_courses on learning_private.courses
  for all to authenticated
  using (education_qa_private.is_admin())
  with check (education_qa_private.is_admin());
create policy platform_admin_all_lessons on learning_private.lessons
  for all to authenticated
  using (education_qa_private.is_admin())
  with check (education_qa_private.is_admin());

create or replace function education_qa_private.course_access(p_action text, p_input jsonb default '{}')
returns jsonb language plpgsql security definer set search_path='' as $$
declare
  actor uuid := education_qa_private.actor();
  admin boolean := education_qa_private.is_admin();
  cid text := p_input->>'courseId';
  num integer := (p_input->>'lesson')::integer;
  n integer;
  course_status text;
begin
  if p_action = 'list' then
    return coalesce((select jsonb_agg(to_jsonb(c) order by c.title) from (
      select c.id, c.title, c.description, c.minutes, c.status,
        (select coalesce(jsonb_agg(jsonb_build_object('id', l.number::text, 'title', l.title) order by l.number), '[]')
           from learning_private.lessons l where l.course_id = c.id and l.archived_at is null) as lessons
      from learning_private.courses c
      where c.status = 'published'
    ) c), '[]');
  elsif p_action = 'manage' then
    if not admin then raise insufficient_privilege; end if;
    return coalesce((select jsonb_agg(to_jsonb(c) order by c.title) from (
      select c.id, c.title, c.description, c.minutes, c.status,
        (select coalesce(jsonb_agg(jsonb_build_object('id', l.number::text, 'title', l.title) order by l.number), '[]')
           from learning_private.lessons l where l.course_id = c.id and l.archived_at is null) as lessons
      from learning_private.courses c
    ) c), '[]');
  elsif p_action in ('create','update','publish','unpublish','archive','lesson.save','lesson.archive') then
    if not admin then raise insufficient_privilege; end if;
    if p_action = 'create' then
      if cid is null or length(cid) > 100 or cid !~ '^[a-z0-9]+(-[a-z0-9]+)*$' or length(btrim(p_input->>'title')) not between 1 and 200 then raise invalid_parameter_value; end if;
      insert into learning_private.courses(id, lesson_count, title, description, minutes, status, custom)
      values (cid, 1, btrim(p_input->>'title'), coalesce(p_input->>'description',''), coalesce((p_input->>'minutes')::integer, 60), 'draft', true);
    else
      select status into course_status from learning_private.courses where id = cid for update;
      if course_status is null then raise insufficient_privilege; end if;
      if course_status = 'archived' and p_action <> 'archive' then raise insufficient_privilege; end if;
      if p_action = 'update' then
        if course_status = 'archived' or length(btrim(p_input->>'title')) not between 1 and 200 then raise invalid_parameter_value; end if;
        update learning_private.courses
          set title = btrim(p_input->>'title'),
              description = coalesce(p_input->>'description',''),
              minutes = coalesce((p_input->>'minutes')::integer, minutes)
          where id = cid;
      elsif p_action = 'lesson.save' then
        if course_status = 'archived' or num is null or num not between 1 and 500 or length(btrim(p_input->>'title')) not between 1 and 200 or jsonb_typeof(p_input->'sections') is distinct from 'array' then raise invalid_parameter_value; end if;
        if exists(select 1 from jsonb_array_elements(p_input->'sections') item where jsonb_typeof(item) is distinct from 'object' or jsonb_typeof(item->'title') is distinct from 'string' or jsonb_typeof(item->'text') is distinct from 'string' or length(coalesce(item->>'title','')) not between 1 and 200 or length(coalesce(item->>'text','')) not between 1 and 20000) then raise invalid_parameter_value; end if;
        insert into learning_private.lessons(course_id, number, title, sections)
        values (cid, num, btrim(p_input->>'title'), p_input->'sections')
        on conflict (course_id, number) do update set title = excluded.title, sections = excluded.sections, archived_at = null;
      elsif p_action = 'lesson.archive' then
        if course_status = 'archived' then raise insufficient_privilege; end if;
        update learning_private.lessons set archived_at = now() where course_id = cid and number = num and archived_at is null;
        if not found then raise invalid_parameter_value; end if;
      elsif p_action = 'publish' then
        select count(*) into n from learning_private.lessons where course_id = cid and archived_at is null;
        if n = 0 or n <> (select max(number) from learning_private.lessons where course_id = cid and archived_at is null) then raise check_violation using message = 'Lessons must be contiguous'; end if;
        update learning_private.courses set status = 'published', lesson_count = n where id = cid;
      elsif p_action = 'unpublish' then
        if course_status <> 'published' then raise invalid_parameter_value; end if;
        update learning_private.courses set status = 'draft' where id = cid;
      elsif p_action = 'archive' then
        update learning_private.courses set status = 'archived' where id = cid;
      end if;
    end if;
    insert into education_qa_private.audit(actor_id, action, detail) values (actor, 'courses.' || p_action, jsonb_build_object('courseId', cid, 'lesson', num));
    return jsonb_build_object('courseId', cid);
  elsif p_action = 'lesson.read' then
    select status into course_status from learning_private.courses where id = cid;
    if course_status is distinct from 'published' then raise insufficient_privilege; end if;
    if exists (select 1 from learning_private.lessons where course_id = cid and number = num and archived_at is not null) then raise insufficient_privilege; end if;
    perform learning_private.access('read', cid, num, '', false);
    return (select jsonb_build_object('id', number::text, 'title', title, 'sections', sections) from learning_private.lessons where course_id = cid and number = num and archived_at is null);
  else
    raise invalid_parameter_value;
  end if;
end $$;

revoke all on function education_qa_private.course_access(text, jsonb) from public, anon;
grant execute on function education_qa_private.course_access(text, jsonb) to authenticated;
commit;
