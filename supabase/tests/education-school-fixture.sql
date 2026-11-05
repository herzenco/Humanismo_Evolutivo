-- Isolated test prerequisites, never apply this fixture to a real Supabase project.
create role anon;
create role authenticated;
create schema auth;
create schema authz;
create table auth.users(id uuid primary key,email text,email_confirmed_at timestamptz,is_anonymous boolean default false,banned_until timestamptz,raw_user_meta_data jsonb default '{}');
create function auth.jwt() returns jsonb language sql stable as $$ select coalesce(nullif(current_setting('request.jwt.claims',true),'')::jsonb,'{}') $$;
create function auth.uid() returns uuid language sql stable as $$ select (auth.jwt()->>'sub')::uuid $$;
grant usage on schema auth to authenticated,anon;
grant execute on function auth.uid(),auth.jwt() to authenticated,anon;
create table authz.permissions(code text primary key,description text);
create table authz.role_permissions(role text,permission_code text,primary key(role,permission_code));
insert into authz.role_permissions values('owner','existing.permission');
create table authz.memberships(user_id uuid primary key,role text,status text);
create function authz.assert_current_admin_permission(p_permission text) returns uuid language plpgsql security definer set search_path='' as $$
begin
 if not exists(select 1 from authz.memberships m join authz.role_permissions p on p.role=m.role where m.user_id=auth.uid() and m.status='active' and p.permission_code=p_permission) or auth.jwt()->>'aal'<>'aal2' then raise insufficient_privilege; end if;
 return auth.uid();
end $$;
create table public.education_qa_classes(id text primary key,content_version text,published boolean);
insert into public.education_qa_classes values('test-class','v1',true);
create table public.education_qa_openings(user_id uuid,event_id uuid primary key,class_id text,content_version text);
create table public.education_qa_completions(user_id uuid,class_id text,content_version text,primary key(user_id,class_id));
create function public.education_qa_record_opening(p_event_id uuid,p_class_id text,p_content_version text) returns void language plpgsql as $$
begin
 if not exists(select 1 from public.education_qa_classes where id=p_class_id and content_version=p_content_version and published) then raise exception 'Invalid class';end if;
 insert into public.education_qa_openings values(auth.uid(),p_event_id,p_class_id,p_content_version) on conflict do nothing;
end $$;
create function public.education_qa_complete_class(p_class_id text,p_content_version text,p_depth double precision) returns void language plpgsql as $$
begin
 if not exists(select 1 from public.education_qa_classes where id=p_class_id and content_version=p_content_version and published) or p_depth is null or not(p_depth>0.5 and p_depth<=1) then raise exception 'Invalid completion';end if;
 insert into public.education_qa_completions values(auth.uid(),p_class_id,p_content_version) on conflict do nothing;
end $$;

create table public.education_qa_reflection_responses(user_id uuid,body text);
create table public.education_qa_journal_entries(user_id uuid,body text);
alter table public.education_qa_reflection_responses enable row level security;
alter table public.education_qa_journal_entries enable row level security;
grant select on public.education_qa_reflection_responses,public.education_qa_journal_entries to authenticated;
create policy own_reflections on public.education_qa_reflection_responses for select to authenticated using(user_id=auth.uid());
create policy own_journals on public.education_qa_journal_entries for select to authenticated using(user_id=auth.uid());
