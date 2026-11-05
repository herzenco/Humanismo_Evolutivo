-- QA-only education access foundation. Shared Auth/admin authorization is read-only.
-- No existing learning rows, private responses or journal policies are changed.
begin;
create schema education_qa_private;
revoke all on schema education_qa_private from public, anon, authenticated;
grant usage on schema education_qa_private to authenticated;
alter default privileges in schema education_qa_private revoke execute on functions from public;

create table education_qa_private.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 1 and 160),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 100),
  is_community boolean not null default false,
  status text not null default 'active' check (status in ('active','archived')),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete restrict
);
create unique index education_qa_one_community on education_qa_private.schools(is_community) where is_community;
insert into education_qa_private.schools(id,name,slug,is_community)
 values('00000000-0000-4000-8000-000000000001','Amigos que Evolucionan','amigos-que-evolucionan',true);

create table education_qa_private.profiles (
  user_id uuid primary key references auth.users(id) on delete restrict,
  display_name text not null,
  email text not null,
  updated_at timestamptz not null default now()
);
create table education_qa_private.memberships (
  school_id uuid not null references education_qa_private.schools(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,
  role text not null check(role in ('student','teacher')),
  status text not null default 'active' check(status in ('active','suspended','removed')),
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  display_name text,
  email text,
  primary key(school_id,user_id,role)
);
create unique index education_qa_one_teacher_school on education_qa_private.memberships(user_id) where role='teacher' and status='active';
create index education_qa_member_lookup on education_qa_private.memberships(user_id,status,school_id);

create table education_qa_private.invitations (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references education_qa_private.schools(id) on delete restrict,
  email text not null check(email=lower(btrim(email)) and length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  status text not null default 'pending' check(status in ('pending','accepted','revoked')),
  invited_by uuid not null references auth.users(id) on delete restrict,
  accepted_by uuid references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now()+interval '14 days'
);
create unique index education_qa_pending_invite on education_qa_private.invitations(school_id,email) where status='pending';
create index education_qa_invite_email on education_qa_private.invitations(email,status);

create table education_qa_private.activity (
  event_id uuid primary key,
  school_id uuid not null references education_qa_private.schools(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete restrict,
  class_id text not null,
  content_version text not null,
  kind text not null check(kind in ('opened','completed')),
  occurred_at timestamptz not null default now()
);
create index education_qa_school_activity on education_qa_private.activity(school_id,user_id,occurred_at desc);
create index education_qa_personal_activity on education_qa_private.activity(user_id,occurred_at desc);
create table education_qa_private.audit (
  id bigint generated always as identity primary key,
  actor_id uuid not null references auth.users(id) on delete restrict,
  action text not null,
  school_id uuid references education_qa_private.schools(id) on delete restrict,
  target_user_id uuid references auth.users(id) on delete restrict,
  detail jsonb not null default '{}',
  occurred_at timestamptz not null default now()
);
create index education_qa_school_audit on education_qa_private.audit(school_id,occurred_at desc);

create index education_qa_school_creator on education_qa_private.schools(created_by);
create index education_qa_invitation_school on education_qa_private.invitations(school_id,created_at desc);
create index education_qa_invitation_sender on education_qa_private.invitations(invited_by);
create index education_qa_invitation_recipient on education_qa_private.invitations(accepted_by);
create index education_qa_audit_actor on education_qa_private.audit(actor_id);
create index education_qa_audit_target on education_qa_private.audit(target_user_id);

-- No direct table grants. All table access is default-deny and mediated by the
-- authenticated facade below; this prevents raw REST/SQL bypass of tenant checks.
alter table education_qa_private.schools enable row level security;
alter table education_qa_private.profiles enable row level security;
alter table education_qa_private.memberships enable row level security;
alter table education_qa_private.invitations enable row level security;
alter table education_qa_private.activity enable row level security;
alter table education_qa_private.audit enable row level security;
revoke all on all tables in schema education_qa_private from public, anon, authenticated;
revoke all on all sequences in schema education_qa_private from public, anon, authenticated;

-- Reuse the central admin permission/session/MFA contract, without assigning users
-- a new administrator role or trusting user-editable metadata.
insert into authz.permissions(code,description) values ('education.qa.manage','Manage QA schools, teachers and student memberships') on conflict do nothing;
insert into authz.role_permissions(role,permission_code)
 select distinct role,'education.qa.manage' from authz.role_permissions where role::text='owner'
 on conflict do nothing;

create function education_qa_private.actor() returns uuid
language plpgsql stable security definer set search_path='' as $$
declare actor uuid;
begin
  select id into actor from auth.users where id=(select auth.uid())
    and email_confirmed_at is not null and email is not null
    and not coalesce(is_anonymous,false)
    and (banned_until is null or banned_until < now())
    and not coalesce((auth.jwt()->>'is_anonymous')::boolean,false);
  if actor is null then raise exception 'Verified account required' using errcode='42501'; end if;
  return actor;
end $$;
create function education_qa_private.is_admin() returns boolean
language plpgsql stable security definer set search_path='' as $$
begin
  perform education_qa_private.actor();
  perform authz.assert_current_admin_permission('education.qa.manage');
  return true;
exception when insufficient_privilege then return false;
end $$;
create function education_qa_private.teaches(p_school uuid) returns boolean
language sql stable security definer set search_path='' as $$
 select exists(select 1 from education_qa_private.memberships m
 join education_qa_private.schools s on s.id=m.school_id
 where m.user_id=education_qa_private.actor() and m.school_id=p_school
 and m.role='teacher' and m.status='active' and s.status='active');
$$;

-- Privileged work stays in a non-exposed schema, with actor and tenant checks
-- repeated on every operation. No client can write roles/tables directly.
create function education_qa_private.access(p_action text,p_input jsonb default '{}') returns jsonb
language plpgsql security definer set search_path='' as $$
declare
  v_actor uuid := education_qa_private.actor();
  v_admin boolean := education_qa_private.is_admin();
  v_school uuid;
  v_target uuid;
  v_id uuid;
  v_role text;
  v_status text;
  v_email text;
  v_result jsonb;
  v_invite education_qa_private.invitations;
  v_old education_qa_private.memberships;
  v_event education_qa_private.activity;
  v_limit integer := greatest(1,least(coalesce((p_input->>'limit')::integer,50),100));
  v_offset integer := greatest(0,coalesce((p_input->>'offset')::integer,0));
  v_community constant uuid := '00000000-0000-4000-8000-000000000001';
begin
  if p_input is null or jsonb_typeof(p_input)<>'object' then raise exception 'Object input required' using errcode='22023'; end if;
  v_school := nullif(p_input->>'schoolId','')::uuid;
  if p_action='context' then
    insert into education_qa_private.profiles(user_id,display_name,email)
      select id,left(coalesce(nullif(btrim(raw_user_meta_data->>'first_name'),''),split_part(email,'@',1)),100),lower(email)
      from auth.users where id=v_actor
      on conflict(user_id) do update set display_name=excluded.display_name,email=excluded.email,updated_at=now();
    insert into education_qa_private.memberships(school_id,user_id,role,display_name,email)
      select v_community,v_actor,'student',display_name,email from education_qa_private.profiles where user_id=v_actor on conflict do nothing;
    if found then insert into education_qa_private.audit(actor_id,action,school_id,target_user_id) values(v_actor,'membership.community_join',v_community,v_actor); end if;
    update education_qa_private.memberships m set display_name=p.display_name,email=p.email from education_qa_private.profiles p
      where p.user_id=v_actor and m.user_id=p.user_id and m.status='active';
    return jsonb_build_object('userId',v_actor,'isPlatformAdmin',v_admin,'defaultSchoolId',v_community,
      'memberships',coalesce((select jsonb_agg(jsonb_build_object('schoolId',s.id,'schoolName',s.name,'role',m.role,'status',m.status,'schoolStatus',s.status,'isCommunity',s.is_community) order by s.name,m.role)
      from education_qa_private.memberships m join education_qa_private.schools s on s.id=m.school_id where m.user_id=v_actor),'[]'::jsonb));
  elsif p_action='schools.list' then
    if not v_admin then raise exception 'Platform admin required' using errcode='42501'; end if;
    select coalesce(jsonb_agg(to_jsonb(s)),'[]') into v_result from (select id,name,slug,status,is_community,created_at from education_qa_private.schools order by name,id limit v_limit offset v_offset) s;
    return v_result;
  elsif p_action='audit.list' then
    if not v_admin then raise exception 'Platform admin required' using errcode='42501'; end if;
    select coalesce(jsonb_agg(to_jsonb(a)),'[]') into v_result from (
      select id,actor_id,action,school_id,target_user_id,detail,occurred_at from education_qa_private.audit
      where v_school is null or school_id=v_school order by occurred_at desc,id desc limit v_limit offset v_offset
    ) a;
    return v_result;
  elsif p_action='people.list' then
    if not v_admin then raise exception 'Platform admin required' using errcode='42501'; end if;
    select coalesce(jsonb_agg(to_jsonb(p)),'[]') into v_result from (
      select u.id user_id,left(coalesce(nullif(btrim(u.raw_user_meta_data->>'first_name'),''),split_part(u.email,'@',1)),100) display_name,u.email,
        coalesce((select jsonb_agg(jsonb_build_object('schoolId',m.school_id,'role',m.role,'status',m.status) order by m.school_id,m.role) from education_qa_private.memberships m where m.user_id=u.id),'[]') memberships
      from auth.users u where u.email_confirmed_at is not null and not coalesce(u.is_anonymous,false)
      order by u.id limit v_limit offset v_offset
    ) p;
    return v_result;
  elsif p_action='schools.create' then
    if not v_admin then raise exception 'Platform admin required' using errcode='42501'; end if;
    insert into education_qa_private.schools(name,slug,created_by) values(btrim(p_input->>'name'),p_input->>'slug',v_actor) returning id into v_school;
  elsif p_action='schools.status' then
    if not v_admin then raise exception 'Platform admin required' using errcode='42501'; end if;
    update education_qa_private.schools set status=p_input->>'status' where id=v_school and not is_community;
    if not found then raise exception 'School unavailable' using errcode='22023'; end if;
    if p_input->>'status'='archived' then update education_qa_private.invitations set status='revoked' where school_id=v_school and status='pending'; end if;
  elsif p_action in ('roster','activity.list','invitations.list') then
    if v_school is null or not(v_admin or education_qa_private.teaches(v_school)) then raise exception 'School access denied' using errcode='42501'; end if;
    if p_action='roster' then
      select coalesce(jsonb_agg(to_jsonb(r)),'[]') into v_result from (
        select m.user_id,m.role,m.status,m.joined_at,m.display_name,m.email,
          (select count(*) from education_qa_private.activity a where a.school_id=m.school_id and a.user_id=m.user_id and a.kind='opened') as openings,
          (select count(distinct a.class_id) from education_qa_private.activity a where a.school_id=m.school_id and a.user_id=m.user_id and a.kind='completed') as completed_classes
        from education_qa_private.memberships m
        where m.school_id=v_school and (v_admin or m.role='student') order by m.user_id,m.role limit v_limit offset v_offset
      ) r;
    elsif p_action='activity.list' then
      -- Explicit projection never includes quiz responses, reflection text or journals.
      select coalesce(jsonb_agg(to_jsonb(a)),'[]') into v_result from (
        select event_id,user_id,class_id,content_version,kind,occurred_at from education_qa_private.activity
        where school_id=v_school and (nullif(p_input->>'userId','') is null or user_id=(p_input->>'userId')::uuid)
        order by occurred_at desc,event_id limit v_limit offset v_offset
      ) a;
    else
      select coalesce(jsonb_agg(to_jsonb(i)),'[]') into v_result from (
        select id,email,status,created_at,expires_at from education_qa_private.invitations where school_id=v_school order by created_at desc,id limit v_limit offset v_offset
      ) i;
    end if;
    return v_result;
  elsif p_action='memberships.set' then
    v_target := (p_input->>'userId')::uuid;
    v_role := p_input->>'role';
    v_status := p_input->>'status';
    if v_school is null or v_target is null or v_role not in ('student','teacher') or v_status not in ('active','suspended','removed') or v_role is null or v_status is null then raise exception 'Invalid membership' using errcode='22023'; end if;
    -- Serialize changes to a person; the partial unique index also enforces one teacher school.
    perform 1 from auth.users where id=v_target for update;
    if not found then raise exception 'Account unavailable' using errcode='22023'; end if;
    select * into v_old from education_qa_private.memberships where school_id=v_school and user_id=v_target and role=v_role for update;
    if not v_admin and not(education_qa_private.teaches(v_school) and v_role='student' and v_old.user_id is not null) then raise exception 'Membership access denied' using errcode='42501'; end if;
    if not v_admin and v_old.status='removed' and v_status='active' then raise exception 'A new invitation must be accepted' using errcode='22023'; end if;
    if v_school=v_community and v_role='student' and v_status<>'active' then raise exception 'Default community membership is retained' using errcode='22023'; end if;
    if v_status='active' and not exists(select 1 from education_qa_private.schools where id=v_school and status='active') then raise exception 'School unavailable' using errcode='22023'; end if;
    insert into education_qa_private.memberships(school_id,user_id,role,status) values(v_school,v_target,v_role,v_status)
      on conflict(school_id,user_id,role) do update set status=excluded.status,updated_at=now();
    if v_status<>'active' then
      update education_qa_private.invitations set status='revoked' where school_id=v_school and status='pending'
        and ((v_role='teacher' and invited_by=v_target) or (v_role='student' and email=(select lower(email) from auth.users where id=v_target)));
    end if;
    insert into education_qa_private.profiles(user_id,display_name,email)
      select id,left(coalesce(nullif(btrim(raw_user_meta_data->>'first_name'),''),split_part(email,'@',1)),100),lower(email) from auth.users where id=v_target on conflict(user_id) do update set display_name=excluded.display_name,email=excluded.email,updated_at=now();
    update education_qa_private.memberships m set display_name=p.display_name,email=p.email from education_qa_private.profiles p
      where m.school_id=v_school and m.user_id=v_target and m.role=v_role and p.user_id=v_target
      and (v_status='active' or m.display_name is null);
  elsif p_action='memberships.leave' then
    if v_school is null or v_school=v_community then raise exception 'Default community membership is retained' using errcode='22023'; end if;
    update education_qa_private.memberships set status='removed',updated_at=now() where school_id=v_school and user_id=v_actor and role='student' and status<>'removed';
    if not found then raise exception 'Student membership unavailable' using errcode='42501'; end if;
    v_target := v_actor;
  elsif p_action='activity.mine' then
    select coalesce(jsonb_agg(to_jsonb(a)),'[]') into v_result from (
      select event_id,school_id,class_id,content_version,kind,occurred_at from education_qa_private.activity where user_id=v_actor
       and (v_school is null or school_id=v_school) order by occurred_at desc,event_id limit v_limit offset v_offset
    ) a;
    return v_result;
  elsif p_action='invitations.create' then
    if v_school is null or not(v_admin or education_qa_private.teaches(v_school)) then raise exception 'School access denied' using errcode='42501'; end if;
    if not exists(select 1 from education_qa_private.schools where id=v_school and status='active') then raise exception 'School unavailable' using errcode='22023'; end if;
    v_email := lower(btrim(p_input->>'email'));
    -- No account-directory lookup or outbound email: invitations are accepted by
    -- the verified matching account from its own pending-invitations list.
    insert into education_qa_private.invitations(school_id,email,invited_by) values(v_school,v_email,v_actor)
      on conflict(school_id,email) where status='pending' do update set expires_at=now()+interval '14 days',invited_by=v_actor returning id into v_id;
  elsif p_action='invitations.revoke' then
    v_id := (p_input->>'invitationId')::uuid;
    select * into v_invite from education_qa_private.invitations where id=v_id for update;
    if v_invite.id is null or not(v_admin or education_qa_private.teaches(v_invite.school_id)) then raise exception 'Invitation access denied' using errcode='42501'; end if;
    v_school := v_invite.school_id;
    update education_qa_private.invitations set status='revoked' where id=v_id and status='pending';
  elsif p_action='invitations.mine' then
    select lower(email) into v_email from auth.users where id=v_actor;
    select coalesce(jsonb_agg(to_jsonb(i)),'[]') into v_result from (
      select i.id,s.id school_id,s.name school_name,i.expires_at from education_qa_private.invitations i join education_qa_private.schools s on s.id=i.school_id
      where i.email=v_email and i.status='pending' and i.expires_at>now() and s.status='active' order by i.created_at,i.id limit v_limit offset v_offset
    ) i;
    return v_result;
  elsif p_action='invitations.accept' then
    v_id := (p_input->>'invitationId')::uuid;
    select * into v_invite from education_qa_private.invitations where id=v_id for update;
    select lower(email) into v_email from auth.users where id=v_actor;
    if v_invite.accepted_by=v_actor and v_invite.status='accepted' then return jsonb_build_object('schoolId',v_invite.school_id,'userId',v_actor); end if;
    if v_invite.id is null or v_invite.email<>v_email or v_invite.status<>'pending' or v_invite.expires_at<=now()
      or not exists(select 1 from education_qa_private.schools where id=v_invite.school_id and status='active') then raise exception 'Invitation unavailable' using errcode='42501'; end if;
    v_school := v_invite.school_id;
    v_target := v_actor;
    insert into education_qa_private.memberships(school_id,user_id,role,display_name,email)
      select v_school,v_actor,'student',left(coalesce(nullif(btrim(raw_user_meta_data->>'first_name'),''),split_part(email,'@',1)),100),lower(email) from auth.users where id=v_actor
      on conflict(school_id,user_id,role) do update set status='active',updated_at=now(),display_name=excluded.display_name,email=excluded.email;
    update education_qa_private.invitations set status='accepted',accepted_by=v_actor where id=v_id;
  elsif p_action='activity.record' then
    v_id := (p_input->>'eventId')::uuid;
    if v_school is null or v_id is null or not exists(select 1 from education_qa_private.memberships m join education_qa_private.schools s on s.id=m.school_id
      where m.user_id=v_actor and m.school_id=v_school and m.role='student' and m.status='active' and s.status='active') then raise exception 'Active school student membership required' using errcode='42501'; end if;
    -- Existing routines retain their publication/version/depth checks. Global personal
    -- progress is preserved; this ledger records the explicitly chosen school context.
    select * into v_event from education_qa_private.activity where event_id=v_id;
    if found then
      if v_event.school_id<>v_school or v_event.user_id<>v_actor or v_event.class_id is distinct from p_input->>'classId' or v_event.content_version is distinct from p_input->>'contentVersion' or v_event.kind is distinct from p_input->>'kind' then raise exception 'Event context conflict' using errcode='22023'; end if;
      return jsonb_build_object('eventId',v_id,'schoolId',v_school);
    end if;
    if p_input->>'kind'='opened' then
      perform public.education_qa_record_opening(v_id,p_input->>'classId',p_input->>'contentVersion');
      if not exists(select 1 from public.education_qa_openings where user_id=v_actor and event_id=v_id and class_id=p_input->>'classId' and content_version=p_input->>'contentVersion') then raise exception 'Opening unavailable' using errcode='22023'; end if;
    elsif p_input->>'kind'='completed' then
      perform public.education_qa_complete_class(p_input->>'classId',p_input->>'contentVersion',(p_input->>'depth')::double precision);
      if not exists(select 1 from public.education_qa_completions where user_id=v_actor and class_id=p_input->>'classId' and content_version=p_input->>'contentVersion') then raise exception 'Completion unavailable' using errcode='22023'; end if;
    else raise exception 'Invalid activity kind' using errcode='22023'; end if;
    insert into education_qa_private.activity(event_id,school_id,user_id,class_id,content_version,kind)
      values(v_id,v_school,v_actor,p_input->>'classId',p_input->>'contentVersion',p_input->>'kind') on conflict do nothing;
    select * into v_event from education_qa_private.activity where event_id=v_id;
    if v_event.school_id<>v_school or v_event.user_id<>v_actor or v_event.class_id is distinct from p_input->>'classId' or v_event.content_version is distinct from p_input->>'contentVersion' or v_event.kind is distinct from p_input->>'kind' then raise exception 'Event context conflict' using errcode='22023'; end if;
    return jsonb_build_object('eventId',v_id,'schoolId',v_school);
  else raise exception 'Unknown education operation' using errcode='22023';
  end if;
  insert into education_qa_private.audit(actor_id,action,school_id,target_user_id,detail)
    values(v_actor,p_action,v_school,v_target,jsonb_strip_nulls(jsonb_build_object('role',v_role,'status',v_status,'invitationId',v_id)));
  return jsonb_strip_nulls(jsonb_build_object('schoolId',v_school,'userId',v_target,'invitationId',v_id));
end $$;

revoke all on all functions in schema education_qa_private from public,anon,authenticated;
grant execute on function education_qa_private.access(text,jsonb) to authenticated;
create function public.education_qa_access(p_action text,p_input jsonb default '{}') returns jsonb
language sql security invoker set search_path='' as $$
 select education_qa_private.access(p_action,p_input);
$$;
revoke all on function public.education_qa_access(text,jsonb) from public,anon;
grant execute on function public.education_qa_access(text,jsonb) to authenticated;
commit;
