begin;
-- Roles are stored in private membership rows, never editable JWT user_metadata.
alter table education_qa_private.memberships drop constraint memberships_role_check;
alter table education_qa_private.memberships add constraint memberships_role_check check(role in ('student','teacher','school_admin'));
drop index education_qa_private.education_qa_one_teacher_school;
create unique index education_qa_one_teacher_school on education_qa_private.memberships(user_id) where role='teacher' and status='active' and school_id<>'00000000-0000-4000-8000-000000000001';
alter table education_qa_private.schools add column onboarding boolean not null default true;
alter table education_qa_private.schools add column reflection_sharing_since timestamptz;
create table education_qa_private.classrooms (
 id uuid primary key default gen_random_uuid(), school_id uuid not null references education_qa_private.schools(id) on delete restrict,
 name text not null check(length(btrim(name)) between 1 and 160), archived_at timestamptz, created_at timestamptz not null default now(), unique(school_id,id)
);
alter table education_qa_private.memberships add column classroom_id uuid;
alter table education_qa_private.memberships add constraint classroom_school_fk foreign key(school_id,classroom_id) references education_qa_private.classrooms(school_id,id) on delete restrict;
alter table education_qa_private.memberships add constraint only_student_placement check(classroom_id is null or role='student');
create table education_qa_private.classroom_teachers (
 school_id uuid not null, classroom_id uuid not null, user_id uuid not null references auth.users(id) on delete restrict,
 primary key(classroom_id,user_id), foreign key(school_id,classroom_id) references education_qa_private.classrooms(school_id,id) on delete restrict
);
create index classroom_teacher_scope on education_qa_private.classroom_teachers(user_id,school_id);
create index school_role_status on education_qa_private.memberships(school_id,role,status);
create index classroom_student_scope on education_qa_private.memberships(classroom_id,user_id) where status='active';
alter table education_qa_private.invitations add column role text not null default 'student' check(role in ('student','teacher','school_admin'));
alter table education_qa_private.invitations add column classroom_id uuid;
create index invitation_classroom_scope on education_qa_private.invitations(classroom_id) where classroom_id is not null;
alter table education_qa_private.invitations add constraint invitation_classroom_school_fk foreign key(school_id,classroom_id) references education_qa_private.classrooms(school_id,id);
alter table education_qa_private.invitations add column delivery_status text not null default 'pending' check(delivery_status in ('pending','sent','failed'));
drop index education_qa_private.education_qa_pending_invite;
create unique index education_qa_pending_invite on education_qa_private.invitations(school_id,email,role) where status='pending';
create table education_qa_private.reflection_submissions (
 user_id uuid not null references auth.users(id) on delete restrict, course_id text not null references learning_private.courses(id),
 lesson integer not null, body text not null, submitted_at timestamptz not null default clock_timestamp(), primary key(user_id,course_id,lesson)
);
-- Existing work predates opt-in and must never become retroactively shareable.
insert into education_qa_private.reflection_submissions(user_id,course_id,lesson,body,submitted_at)
 select w.user_id,w.course_id,w.lesson,w.reflection,w.updated_at from learning_private.work w join learning_private.progress p on p.user_id=w.user_id and p.course_id=w.course_id where w.lesson<=p.completed;
create table education_qa_private.reflection_grants (
 school_id uuid not null references education_qa_private.schools(id), user_id uuid not null, course_id text not null, lesson integer not null,
 primary key(school_id,user_id,course_id,lesson), foreign key(user_id,course_id,lesson) references education_qa_private.reflection_submissions(user_id,course_id,lesson)
);
alter table education_qa_private.classrooms enable row level security;
alter table education_qa_private.classroom_teachers enable row level security;
alter table education_qa_private.reflection_submissions enable row level security;
alter table education_qa_private.reflection_grants enable row level security;
revoke all on education_qa_private.classrooms,education_qa_private.classroom_teachers,education_qa_private.reflection_submissions,education_qa_private.reflection_grants from public,anon,authenticated;
create function education_qa_private.school_admin(p_school uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from education_qa_private.memberships m join education_qa_private.schools s on s.id=m.school_id where m.school_id=p_school and m.user_id=education_qa_private.actor() and m.role='school_admin' and m.status='active' and s.status='active');
$$;
create function education_qa_private.can_view_student(p_school uuid,p_user uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from education_qa_private.schools s join education_qa_private.memberships m on m.school_id=s.id and m.user_id=p_user and m.role='student' and m.status='active'
 where s.id=p_school and s.status='active' and (education_qa_private.is_admin() or education_qa_private.school_admin(s.id) or (education_qa_private.teaches(s.id) and (s.is_community or exists(select 1 from education_qa_private.classroom_teachers t join education_qa_private.classrooms c on c.id=t.classroom_id where t.school_id=s.id and t.user_id=education_qa_private.actor() and t.classroom_id=m.classroom_id and c.archived_at is null)))));
$$;
create function education_qa_private.admin_continuity() returns trigger language plpgsql security definer set search_path='' as $$
declare sid uuid;
begin
 if tg_table_name='schools' then sid:=new.id; else sid:=coalesce(new.school_id,old.school_id); end if;
 if exists(select 1 from education_qa_private.schools where id=sid and not onboarding) and not exists(select 1 from education_qa_private.memberships where school_id=sid and role='school_admin' and status='active') then raise check_violation using message='Every onboarded school requires an administrator'; end if;
 return null;
end $$;
create constraint trigger school_admin_required after insert or update or delete on education_qa_private.memberships deferrable initially deferred for each row execute function education_qa_private.admin_continuity();
create constraint trigger school_admin_required after insert or update on education_qa_private.schools deferrable initially deferred for each row execute function education_qa_private.admin_continuity();
-- Automatic community membership exists for every account, including staff.
create function education_qa_private.join_community() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into education_qa_private.memberships(school_id,user_id,role,display_name,email) values('00000000-0000-4000-8000-000000000001',new.id,'student',left(coalesce(new.raw_user_meta_data->>'first_name',split_part(new.email,'@',1)),100),lower(new.email)) on conflict do nothing;
 return new;
end $$;
create trigger portal_community_join after insert on auth.users for each row execute function education_qa_private.join_community();
insert into education_qa_private.memberships(school_id,user_id,role,display_name,email)
 select '00000000-0000-4000-8000-000000000001',id,'student',left(coalesce(raw_user_meta_data->>'first_name',split_part(email,'@',1)),100),lower(email) from auth.users on conflict do nothing;

alter function education_qa_private.access(text,jsonb) rename to access_legacy;
revoke all on function education_qa_private.access_legacy(text,jsonb) from public,anon,authenticated;
create function education_qa_private.access(p_action text,p_input jsonb default '{}') returns jsonb language plpgsql security definer set search_path='' as $$
declare
 actor uuid:=education_qa_private.actor(); admin boolean:=education_qa_private.is_admin(); sid uuid:=nullif(p_input->>'schoolId','')::uuid;
 target uuid:=nullif(p_input->>'userId','')::uuid; cid uuid:=nullif(p_input->>'classroomId','')::uuid; iid uuid; result jsonb; inv education_qa_private.invitations;
 role_name text:=p_input->>'role'; state text:=p_input->>'status'; email_address text:=lower(btrim(p_input->>'email'));
 lim integer:=coalesce((p_input->>'limit')::integer,50); off integer:=coalesce((p_input->>'offset')::integer,0); community constant uuid:='00000000-0000-4000-8000-000000000001';
begin
 if p_input is null or jsonb_typeof(p_input)<>'object' or lim not between 1 and 100 or off not between 0 and 100000 then raise invalid_parameter_value; end if;
 if sid is not null then perform 1 from education_qa_private.schools where id=sid for update; if not found then raise invalid_parameter_value; end if; end if;
 if p_action='context' then return education_qa_private.access_legacy(p_action,p_input);
 elsif p_action in ('schools.list','people.list','audit.list','activity.mine') then return education_qa_private.access_legacy(p_action,p_input);
 elsif p_action='memberships.leave' then raise insufficient_privilege using message='Staff manage memberships';
 elsif p_action='schools.create' then
  if not admin then raise insufficient_privilege; end if;
  if nullif(btrim(p_input->>'adminEmail'),'') is null then raise invalid_parameter_value using message='Initial administrator invitation required'; end if;
  insert into education_qa_private.schools(name,slug,created_by) values(btrim(p_input->>'name'),p_input->>'slug',actor) returning id into sid;
  insert into education_qa_private.invitations(school_id,email,role,invited_by) values(sid,lower(btrim(p_input->>'adminEmail')),'school_admin',actor) returning id into iid;
 elsif p_action='schools.status' then
  if not admin or sid=community or state not in ('active','archived') or state is null then raise insufficient_privilege; end if;
  update education_qa_private.schools set status=state where id=sid;
  if state='archived' then update education_qa_private.invitations set status='revoked' where school_id=sid and status='pending'; end if;
 elsif p_action='schools.settings' then
  if not(admin or education_qa_private.school_admin(sid)) then raise insufficient_privilege; end if;
  if jsonb_typeof(p_input->'shareReflections')<>'boolean' or not(p_input?'shareReflections') then raise invalid_parameter_value; end if;
  update education_qa_private.schools set reflection_sharing_since=case when (p_input->>'shareReflections')::boolean then coalesce(reflection_sharing_since,clock_timestamp()) else null end where id=sid;
 elsif p_action='school.detail' then
  if not(admin or education_qa_private.school_admin(sid) or education_qa_private.teaches(sid)) then raise insufficient_privilege; end if;
  return (select jsonb_build_object('id',id,'name',name,'isCommunity',is_community,'onboarding',onboarding,'status',status,'sharingSince',reflection_sharing_since) from education_qa_private.schools where id=sid);
 elsif p_action='classrooms.list' then
  if not(admin or education_qa_private.school_admin(sid) or education_qa_private.teaches(sid)) then raise insufficient_privilege; end if;
  return coalesce((select jsonb_agg(to_jsonb(r)) from(select c.id,c.name,c.archived_at,(select coalesce(jsonb_agg(user_id),'[]') from education_qa_private.classroom_teachers where classroom_id=c.id) teachers from education_qa_private.classrooms c where c.school_id=sid and (admin or education_qa_private.school_admin(sid) or exists(select 1 from education_qa_private.classroom_teachers where classroom_id=c.id and user_id=actor)) order by c.name limit lim offset off)r),'[]');
 elsif p_action in ('classrooms.create','classrooms.assign','classrooms.place','classrooms.archive') then
  if not(admin or education_qa_private.school_admin(sid)) or sid=community or not exists(select 1 from education_qa_private.schools where id=sid and status='active') then raise insufficient_privilege; end if;
  if p_action='classrooms.create' then insert into education_qa_private.classrooms(school_id,name) values(sid,btrim(p_input->>'name')) returning id into cid;
  else
   if not(p_action='classrooms.place' and cid is null) and not exists(select 1 from education_qa_private.classrooms where school_id=sid and id=cid and archived_at is null) then raise invalid_parameter_value; end if;
   if p_action='classrooms.assign' then
    if not exists(select 1 from education_qa_private.memberships where school_id=sid and user_id=target and role='teacher' and status='active') then raise invalid_parameter_value; end if;
    if coalesce((p_input->>'assigned')::boolean,true) then insert into education_qa_private.classroom_teachers values(sid,cid,target) on conflict do nothing;
    else delete from education_qa_private.classroom_teachers where classroom_id=cid and user_id=target; end if;
   elsif p_action='classrooms.place' then
    update education_qa_private.memberships set classroom_id=cid,updated_at=now() where school_id=sid and user_id=target and role='student' and status='active'; if not found then raise invalid_parameter_value; end if;
   else
    update education_qa_private.classrooms set archived_at=now() where id=cid;
    update education_qa_private.memberships set classroom_id=null where school_id=sid and classroom_id=cid;
    delete from education_qa_private.classroom_teachers where classroom_id=cid;
    update education_qa_private.invitations set status='revoked' where classroom_id=cid and status='pending';
   end if;
  end if;
 elsif p_action='roster' then
  if not(admin or education_qa_private.school_admin(sid) or education_qa_private.teaches(sid)) then raise insufficient_privilege; end if;
  return coalesce((select jsonb_agg(to_jsonb(r)) from(select m.user_id,m.role,m.status,m.display_name,m.email,m.classroom_id,0 openings,coalesce((select sum(completed) from learning_private.progress where user_id=m.user_id),0) completed_classes from education_qa_private.memberships m where m.school_id=sid and (admin or education_qa_private.school_admin(sid) or (m.role='student' and education_qa_private.can_view_student(sid,m.user_id))) order by m.user_id,m.role limit lim offset off)r),'[]');
 elsif p_action='activity.list' then
  if not(admin or education_qa_private.school_admin(sid) or education_qa_private.teaches(sid)) then raise insufficient_privilege; end if;
  return coalesce((select jsonb_agg(to_jsonb(r)) from(select event_id,user_id,class_id,content_version,kind,occurred_at from education_qa_private.activity a where a.school_id=sid and (target is null or a.user_id=target) and (admin or education_qa_private.school_admin(sid) or education_qa_private.can_view_student(sid,a.user_id)) order by occurred_at desc limit lim offset off)r),'[]');
 elsif p_action='memberships.set' then
  if target is null or role_name not in ('student','teacher','school_admin') or state not in ('active','suspended','removed') or role_name is null or state is null then raise invalid_parameter_value; end if;
  perform 1 from auth.users where id=target for update;
  if role_name='school_admin' then
   if state='active' then
    if not(admin or education_qa_private.school_admin(sid)) or not exists(select 1 from education_qa_private.memberships where school_id=sid and user_id=target and role='teacher' and status='active') then raise insufficient_privilege; end if;
    insert into education_qa_private.memberships(school_id,user_id,role) values(sid,target,'school_admin') on conflict(school_id,user_id,role) do update set status='active';
    update education_qa_private.schools set onboarding=false where id=sid;
   else
    if not admin then raise insufficient_privilege; end if;
    if (select count(*) from education_qa_private.memberships where school_id=sid and role='school_admin' and status='active' and user_id<>target)=0 then raise check_violation using message='Keep at least one school administrator'; end if;
    update education_qa_private.memberships set status=state,updated_at=now() where school_id=sid and user_id=target and role=role_name;
   end if;
  else
   if not(admin or education_qa_private.school_admin(sid) or (role_name='student' and education_qa_private.can_view_student(sid,target))) then raise insufficient_privilege; end if;
   if role_name='teacher' and exists(select 1 from education_qa_private.memberships where school_id=sid and user_id=target and role='school_admin' and status='active') and state<>'active' then raise insufficient_privilege using message='Revoke administrator role first'; end if;
   if sid=community and role_name='student' and state<>'active' then raise check_violation; end if;
   if state='active' and not exists(select 1 from education_qa_private.memberships where school_id=sid and user_id=target and role=role_name and status<>'removed') then raise insufficient_privilege using message='Invitation acceptance required'; end if;
   update education_qa_private.memberships set status=state,classroom_id=case when state='active' then classroom_id else null end,updated_at=now() where school_id=sid and user_id=target and role=role_name;
   if not found then raise invalid_parameter_value; end if;
   if state<>'active' then
    if role_name='teacher' then delete from education_qa_private.classroom_teachers where school_id=sid and user_id=target; end if;
    update education_qa_private.invitations set status='revoked' where school_id=sid and status='pending' and ((email=(select lower(email) from auth.users where id=target) and role=role_name) or (role_name='teacher' and invited_by=target));
   end if;
  end if;
 elsif p_action='invitations.create' then
  role_name:=coalesce(role_name,'student');
  if role_name not in ('student','teacher','school_admin') or not(admin or education_qa_private.school_admin(sid) or (role_name='student' and education_qa_private.teaches(sid))) then raise insufficient_privilege; end if;
  if not exists(select 1 from education_qa_private.schools where id=sid and status='active') then raise insufficient_privilege; end if;
  if sid=community and cid is not null then raise invalid_parameter_value; end if;
  if cid is not null and not exists(select 1 from education_qa_private.classrooms where id=cid and school_id=sid and archived_at is null) then raise invalid_parameter_value; end if;
  if not(admin or education_qa_private.school_admin(sid)) and sid<>community and (cid is null or not exists(select 1 from education_qa_private.classroom_teachers where classroom_id=cid and user_id=actor)) then raise insufficient_privilege; end if;
  insert into education_qa_private.invitations(school_id,email,role,classroom_id,invited_by) values(sid,email_address,role_name,case when role_name='student' then cid else null end,actor)
   on conflict(school_id,email,role) where status='pending' do update set expires_at=now()+interval '14 days',invited_by=actor,classroom_id=excluded.classroom_id,delivery_status='pending' returning id into iid;
 elsif p_action='invitations.mine' then
  return coalesce((select jsonb_agg(to_jsonb(r)) from(select i.id,i.school_id,s.name school_name,i.role,i.expires_at from education_qa_private.invitations i join education_qa_private.schools s on s.id=i.school_id where i.email=(select lower(email) from auth.users where id=actor) and i.status='pending' and i.expires_at>now() and s.status='active' order by i.created_at limit lim offset off)r),'[]');
 elsif p_action='invitations.list' then
  if not(admin or education_qa_private.school_admin(sid) or education_qa_private.teaches(sid)) then raise insufficient_privilege; end if;
  return coalesce((select jsonb_agg(to_jsonb(r)) from(select id,email,role,status,expires_at,delivery_status,classroom_id from education_qa_private.invitations where school_id=sid and (admin or education_qa_private.school_admin(sid) or invited_by=actor) order by created_at desc limit lim offset off)r),'[]');
 elsif p_action in ('invitations.revoke','invitations.delivery','invitations.prepare','invitations.accept') then
  iid:=(p_input->>'invitationId')::uuid;
  -- Lock the school before the invitation, consistently with administrative removal.
  select school_id into sid from education_qa_private.invitations where id=iid;
  perform 1 from education_qa_private.schools where id=sid for update;
  select * into inv from education_qa_private.invitations where id=iid for update;
  if inv.id is null then raise insufficient_privilege; end if;
  if p_action='invitations.accept' then
   if inv.email is distinct from (select lower(email) from auth.users where id=actor) then raise insufficient_privilege; end if;
   if inv.status='accepted' and inv.accepted_by=actor then return jsonb_build_object('schoolId',sid); end if;
   if inv.status<>'pending' or inv.expires_at<=now() or not exists(select 1 from education_qa_private.schools where id=sid and status='active') then raise insufficient_privilege; end if;
   if inv.classroom_id is not null and not exists(select 1 from education_qa_private.classrooms where id=inv.classroom_id and archived_at is null) then raise insufficient_privilege; end if;
   if not(education_qa_private.is_admin_for_user(inv.invited_by) or education_qa_private.staff_can_invite(inv.invited_by,sid,inv.role,inv.classroom_id)) then raise insufficient_privilege using message='Inviter no longer authorized'; end if;
   perform 1 from auth.users where id=actor for update;
   insert into education_qa_private.memberships(school_id,user_id,role,classroom_id,display_name,email)
    select sid,actor,case when inv.role='school_admin' then 'teacher' else inv.role end,inv.classroom_id,left(coalesce(raw_user_meta_data->>'first_name',split_part(email,'@',1)),100),lower(email) from auth.users where id=actor
    on conflict(school_id,user_id,role) do update set status='active',classroom_id=coalesce(education_qa_private.memberships.classroom_id,excluded.classroom_id),display_name=excluded.display_name,email=excluded.email,updated_at=now();
   if inv.role='school_admin' then
    insert into education_qa_private.memberships(school_id,user_id,role,display_name,email) select sid,actor,'school_admin',display_name,email from education_qa_private.memberships where school_id=sid and user_id=actor and role='teacher' on conflict(school_id,user_id,role) do update set status='active';
    update education_qa_private.schools set onboarding=false where id=sid;
   end if;
   update education_qa_private.invitations set status='accepted',accepted_by=actor where id=iid;
  else
   if not(admin or education_qa_private.school_admin(sid) or (inv.invited_by=actor and education_qa_private.teaches(sid))) then raise insufficient_privilege; end if;
   if p_action='invitations.prepare' then
    if inv.status<>'pending' or inv.expires_at<=now() or not exists(select 1 from education_qa_private.schools where id=sid and status='active') then raise invalid_parameter_value; end if;
    return jsonb_build_object('email',inv.email,'schoolName',(select name from education_qa_private.schools where id=sid));
   elsif p_action='invitations.revoke' then update education_qa_private.invitations set status='revoked' where id=iid and status='pending';
   else
    if p_input->>'deliveryStatus' not in ('sent','failed') or not(p_input?'deliveryStatus') then raise invalid_parameter_value; end if;
    update education_qa_private.invitations set delivery_status=p_input->>'deliveryStatus' where id=iid;
   end if;
  end if;
 elsif p_action='reflections.list' then
  target:=(p_input->>'userId')::uuid;
  if not(admin or education_qa_private.can_view_student(sid,target)) then raise insufficient_privilege; end if;
  return coalesce((select jsonb_agg(to_jsonb(r)) from(select f.course_id,f.lesson,f.body,f.submitted_at from education_qa_private.reflection_submissions f where f.user_id=target and (admin or exists(select 1 from education_qa_private.reflection_grants g join education_qa_private.schools s on s.id=g.school_id where g.school_id=sid and g.user_id=f.user_id and g.course_id=f.course_id and g.lesson=f.lesson and s.reflection_sharing_since is not null and f.submitted_at>=s.reflection_sharing_since)) order by f.submitted_at desc limit lim offset off)r),'[]');
 else raise invalid_parameter_value using message='Unsupported education operation';
 end if;
 insert into education_qa_private.audit(actor_id,action,school_id,target_user_id,detail) values(actor,p_action,sid,target,jsonb_strip_nulls(jsonb_build_object('role',role_name,'status',state,'invitationId',iid,'classroomId',cid)));
 return jsonb_strip_nulls(jsonb_build_object('schoolId',sid,'invitationId',iid,'classroomId',cid));
end $$;
-- Revalidate invitation authority at acceptance using durable database roles.
create function education_qa_private.is_admin_for_user(p_user uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from authz.memberships m join authz.role_permissions rp on rp.role=m.role join auth.users u on u.id=m.user_id where m.user_id=p_user and m.status='active' and rp.permission_code='education.qa.manage' and not coalesce(u.is_anonymous,false) and (u.banned_until is null or u.banned_until<now()));
$$;
create function education_qa_private.staff_can_invite(p_user uuid,p_school uuid,p_role text,p_classroom uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from education_qa_private.memberships m join auth.users u on u.id=m.user_id where (u.banned_until is null or u.banned_until<now()) and not coalesce(u.is_anonymous,false) and m.user_id=p_user and m.school_id=p_school and m.status='active' and (m.role='school_admin' or (m.role='teacher' and p_role='student' and (p_school='00000000-0000-4000-8000-000000000001' or exists(select 1 from education_qa_private.classroom_teachers t join education_qa_private.classrooms c on c.id=t.classroom_id where t.user_id=p_user and t.classroom_id=p_classroom and c.archived_at is null)))));
$$;
-- Rebind the invoker facade after replacing its implementation.
create or replace function public.education_qa_access(p_action text,p_input jsonb default '{}') returns jsonb language sql security invoker set search_path='' as $$ select education_qa_private.access(p_action,p_input) $$;
revoke all on all functions in schema education_qa_private from public,anon,authenticated;
grant execute on function education_qa_private.access(text,jsonb) to authenticated;
create or replace function education_qa_private.teacher_dashboard(p_school uuid,p_query text default '',p_limit integer default 25,p_offset integer default 0)
returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid := education_qa_private.actor(); result jsonb; school_name text;
begin
 if p_school is null or not(education_qa_private.teaches(p_school) or education_qa_private.is_admin()) then raise insufficient_privilege; end if;
 select name into school_name from education_qa_private.schools where id=p_school and status='active';
 if school_name is null then raise insufficient_privilege; end if;
 if p_query is null or length(p_query)>200 or p_limit is null or p_limit not between 1 and 100 or p_offset is null or p_offset not between 0 and 100000 then raise invalid_parameter_value; end if;
 with active_students as (
  select user_id,display_name,email from education_qa_private.memberships where school_id=p_school and role='student' and status='active' and education_qa_private.can_view_student(p_school,user_id)
 ), matching as (
  select * from active_students where p_query='' or position(lower(btrim(p_query)) in lower(coalesce(display_name,'')||' '||coalesce(email,'')))>0
 ), page as (
  select * from matching order by lower(coalesce(display_name,email,'')),user_id limit p_limit offset p_offset
 ), rows as (
  select m.user_id as "userId",m.display_name as "displayName",m.email,
   (select count(*) from education_qa_private.attendance a where a.school_id=p_school and a.user_id=m.user_id and a.status='present') as "attendedSessions",
   (select count(*) from education_qa_private.attendance a where a.school_id=p_school and a.user_id=m.user_id and a.status='absent') as "absentSessions",
   (select coalesce(jsonb_agg(jsonb_build_object('courseId',c.id,'total',c.lesson_count,'completed',coalesce(p.completed,0)) order by c.id),'[]'::jsonb)
    from learning_private.courses c left join learning_private.progress p on p.course_id=c.id and p.user_id=m.user_id where c.status='published') as courses
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
grant execute on function education_qa_private.teacher_dashboard(uuid,text,integer,integer) to authenticated;
alter function education_qa_private.attendance_access(text,jsonb) rename to attendance_legacy;
revoke all on function education_qa_private.attendance_legacy(text,jsonb) from public,anon,authenticated;
create function education_qa_private.attendance_access(p_action text,p_input jsonb default '{}') returns jsonb language plpgsql security definer set search_path='' as $$
begin
 perform education_qa_private.actor();
 if p_action='mine' then
  return jsonb_build_object('presentSessions',(select count(*) from education_qa_private.attendance where user_id=auth.uid() and school_id='00000000-0000-4000-8000-000000000001' and status='present'),
   'presentCourses',(select count(distinct s.course_id) from education_qa_private.attendance a join education_qa_private.scheduled_sessions s on s.id=a.session_id where a.user_id=auth.uid() and a.school_id='00000000-0000-4000-8000-000000000001' and a.status='present'),
   'courses',coalesce((select jsonb_agg(to_jsonb(r)) from(select s.course_id as "courseId",min(s.title) title,count(*) filter(where a.status='present') present,count(*) filter(where a.status='absent') absent
    from education_qa_private.attendance a join education_qa_private.scheduled_sessions s on s.id=a.session_id where a.user_id=auth.uid() and a.school_id='00000000-0000-4000-8000-000000000001' group by s.course_id)r),'[]'));
 end if;
 if (p_input->>'schoolId')::uuid is distinct from '00000000-0000-4000-8000-000000000001'::uuid then raise insufficient_privilege using message='Attendance is only available in Amigos'; end if;
 return education_qa_private.attendance_legacy(p_action,p_input);
end $$;
grant execute on function education_qa_private.attendance_access(text,jsonb) to authenticated;
create or replace function public.portal_attendance_access(p_action text,p_input jsonb default '{}') returns jsonb language sql security invoker set search_path='' as $$ select education_qa_private.attendance_access(p_action,p_input) $$;
-- Preserve the original sequence and write lock, adding immutable submission snapshots.
alter function learning_private.access(text,text,integer,text,boolean) rename to access_legacy;
revoke all on function learning_private.access_legacy(text,text,integer,text,boolean) from public,anon,authenticated;
create function learning_private.access(p_action text,p_course text,p_lesson integer,p_reflection text,p_reviewed boolean) returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb; fresh boolean;
begin
 perform education_qa_private.actor();
 if p_action<>'summary' and not exists(select 1 from learning_private.courses where id=p_course and status='published') then raise invalid_parameter_value; end if;
 result:=learning_private.access_legacy(p_action,p_course,p_lesson,p_reflection,p_reviewed);
 if p_action='complete' then
  insert into education_qa_private.reflection_submissions(user_id,course_id,lesson,body) values(auth.uid(),p_course,p_lesson,p_reflection) on conflict do nothing;
  fresh:=found;
  if fresh then
   insert into education_qa_private.reflection_grants(school_id,user_id,course_id,lesson)
   select s.id,auth.uid(),p_course,p_lesson from education_qa_private.schools s join education_qa_private.memberships m on m.school_id=s.id and m.user_id=auth.uid() and m.role='student' and m.status='active'
   where s.status='active' and s.reflection_sharing_since is not null;
  end if;
 end if;
 return result;
end $$;
revoke all on function learning_private.access(text,text,integer,text,boolean) from public,anon,authenticated;
grant execute on function learning_private.access(text,text,integer,text,boolean) to authenticated;
create or replace function public.portal_learning_access(p_action text,p_course text default null,p_lesson integer default null,p_reflection text default '',p_reviewed boolean default false) returns jsonb language sql security invoker set search_path='' as $$ select learning_private.access(p_action,p_course,p_lesson,p_reflection,p_reviewed) $$;
alter table learning_private.courses add column title text;
alter table learning_private.courses add column description text not null default '';
alter table learning_private.courses add column minutes integer not null default 60 check(minutes between 1 and 600);
alter table learning_private.courses add column status text not null default 'published' check(status in ('draft','published'));
alter table learning_private.courses add column custom boolean not null default false;
alter table learning_private.courses add constraint custom_title_required check(not custom or (title is not null and length(btrim(title)) between 1 and 200));
alter table learning_private.courses add constraint course_description_length check(length(description)<=2000);
create table learning_private.lessons (
 course_id text not null references learning_private.courses(id), number integer not null check(number between 1 and 500),
 title text not null check(length(btrim(title)) between 1 and 200), sections jsonb not null check(jsonb_typeof(sections)='array' and jsonb_array_length(sections)>0), primary key(course_id,number)
);
alter table learning_private.lessons enable row level security;
revoke all on learning_private.lessons from public,anon,authenticated;
create function education_qa_private.course_access(p_action text,p_input jsonb default '{}') returns jsonb language plpgsql security definer set search_path='' as $$
declare actor uuid:=education_qa_private.actor(); admin boolean:=education_qa_private.is_admin(); cid text:=p_input->>'courseId'; num integer:=(p_input->>'lesson')::integer; result jsonb; n integer;
begin
 if p_action='list' or p_action='manage' then
  if p_action='manage' and not admin then raise insufficient_privilege; end if;
  return coalesce((select jsonb_agg(to_jsonb(c)) from(select c.id,c.title,c.description,c.minutes,c.status,c.custom,c.lesson_count,(select coalesce(jsonb_agg(jsonb_build_object('id',number::text,'title',title) order by number),'[]') from learning_private.lessons where course_id=c.id) lessons from learning_private.courses c where (p_action='manage' or c.status='published') and c.custom order by c.title)c),'[]');
 elsif p_action in ('create','lesson.save','publish') then
  if not admin then raise insufficient_privilege; end if;
  if p_action='create' then
   if cid is null or length(cid)>100 or cid !~ '^[a-z0-9]+(-[a-z0-9]+)*$' or length(btrim(p_input->>'title')) not between 1 and 200 then raise invalid_parameter_value; end if;
   insert into learning_private.courses(id,lesson_count,title,description,minutes,status,custom) values(cid,1,btrim(p_input->>'title'),coalesce(p_input->>'description',''),coalesce((p_input->>'minutes')::integer,60),'draft',true);
  else
   perform 1 from learning_private.courses where id=cid and custom and status='draft' for update; if not found then raise insufficient_privilege; end if;
   if p_action='lesson.save' then
    if num is null or num not between 1 and 500 or length(btrim(p_input->>'title')) not between 1 and 200 or jsonb_typeof(p_input->'sections') is distinct from 'array' then raise invalid_parameter_value; end if;
    if exists(select 1 from jsonb_array_elements(p_input->'sections') item where jsonb_typeof(item) is distinct from 'object' or jsonb_typeof(item->'title') is distinct from 'string' or jsonb_typeof(item->'text') is distinct from 'string' or length(coalesce(item->>'title','')) not between 1 and 200 or length(coalesce(item->>'text','')) not between 1 and 20000) then raise invalid_parameter_value; end if;
    insert into learning_private.lessons values(cid,num,btrim(p_input->>'title'),p_input->'sections') on conflict(course_id,number) do update set title=excluded.title,sections=excluded.sections;
   else
    select count(*) into n from learning_private.lessons where course_id=cid;
    if n=0 or n<>(select max(number) from learning_private.lessons where course_id=cid) then raise check_violation using message='Lessons must be contiguous'; end if;
    update learning_private.courses set status='published',lesson_count=n where id=cid;
   end if;
  end if;
  insert into education_qa_private.audit(actor_id,action,detail) values(actor,'courses.'||p_action,jsonb_build_object('courseId',cid,'lesson',num));
  return jsonb_build_object('courseId',cid);
 elsif p_action='lesson.read' then
  perform learning_private.access('read',cid,num,'',false);
  return (select jsonb_build_object('id',number::text,'title',title,'sections',sections) from learning_private.lessons where course_id=cid and number=num);
 else raise invalid_parameter_value;
 end if;
end $$;
revoke all on function education_qa_private.course_access(text,jsonb) from public,anon;
grant execute on function education_qa_private.course_access(text,jsonb) to authenticated;
create function public.portal_course_access(p_action text,p_input jsonb default '{}') returns jsonb language sql security invoker set search_path='' as $$ select education_qa_private.course_access(p_action,p_input) $$;
revoke all on function public.portal_course_access(text,jsonb) from public,anon;
grant execute on function public.portal_course_access(text,jsonb) to authenticated;
commit;
