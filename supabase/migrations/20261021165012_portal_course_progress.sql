begin;
create schema if not exists learning_private;
revoke all on schema learning_private from public, anon, authenticated;
create table learning_private.courses (id text primary key, lesson_count integer not null check(lesson_count>0));
insert into learning_private.courses values ('yo-soy-nosotros',45),('ecologia-y-espiritualidad',45),('humanismo-evolutivo-transpersonal',45),('el-arte-de-ser-empresario',11);
create table learning_private.progress (
 user_id uuid not null references auth.users(id) on delete cascade,
 course_id text not null references learning_private.courses(id),
 completed integer not null default 0 check(completed>=0), primary key(user_id,course_id)
);
create table learning_private.work (
 user_id uuid not null references auth.users(id) on delete cascade,
 course_id text not null references learning_private.courses(id), lesson integer not null check(lesson>0),
 reflection text not null default '' check(length(reflection)<=20000), reviewed boolean not null default false,
 updated_at timestamptz not null default now(), primary key(user_id,course_id,lesson)
);
alter table learning_private.courses enable row level security;
alter table learning_private.progress enable row level security;
alter table learning_private.work enable row level security;
-- Internal definer keeps writes behind the atomic sequence check. No direct table grants.
create function learning_private.access(p_action text, p_course text, p_lesson integer, p_reflection text, p_reviewed boolean)
returns jsonb language plpgsql security definer set search_path='' as $$
declare u uuid := auth.uid(); n integer; done integer; result jsonb;
begin
 if u is null or coalesce((auth.jwt()->>'is_anonymous')::boolean,false) or not exists(select 1 from auth.users where id=u and email_confirmed_at is not null and not coalesce(is_anonymous,false) and (banned_until is null or banned_until<now())) then raise insufficient_privilege using message='Authentication required'; end if;
 if p_action='summary' then return coalesce((select jsonb_object_agg(course_id,completed) from learning_private.progress where user_id=u),'{}'::jsonb); end if;
 if p_action not in ('read','save','complete') then raise invalid_parameter_value; end if;
 select lesson_count into n from learning_private.courses where id=p_course;
 if n is null or p_lesson is null or p_lesson<1 or p_lesson>n then raise invalid_parameter_value; end if;
 insert into learning_private.progress(user_id,course_id) values(u,p_course) on conflict do nothing;
 select completed into done from learning_private.progress where user_id=u and course_id=p_course for update;
 if p_lesson>done+1 then raise insufficient_privilege using message='Complete previous classes first'; end if;
 if p_action in ('save','complete') then
  if p_reflection is null or length(p_reflection)>20000 or p_reviewed is null then raise invalid_parameter_value; end if;
  if p_action='complete' and (not p_reviewed or length(trim(p_reflection))<20) then raise check_violation using message='Review the class and write a reflection'; end if;
  insert into learning_private.work(user_id,course_id,lesson,reflection,reviewed) values(u,p_course,p_lesson,p_reflection,p_reviewed)
   on conflict(user_id,course_id,lesson) do update set reflection=excluded.reflection, reviewed=excluded.reviewed, updated_at=now();
  if p_action='complete' and p_lesson=done+1 then done:=p_lesson; update learning_private.progress set completed=done where user_id=u and course_id=p_course; end if;
 end if;
 select jsonb_build_object('reflection',reflection,'reviewed',reviewed) into result from learning_private.work where user_id=u and course_id=p_course and lesson=p_lesson;
 return jsonb_build_object('completed',done,'work',coalesce(result,'{"reflection":"","reviewed":false}'::jsonb));
end $$;
revoke all on function learning_private.access(text,text,integer,text,boolean) from public,anon,authenticated;
grant usage on schema learning_private to authenticated;
grant execute on function learning_private.access(text,text,integer,text,boolean) to authenticated;
create function public.portal_learning_access(p_action text, p_course text default null, p_lesson integer default null, p_reflection text default '', p_reviewed boolean default false)
returns jsonb language sql security invoker set search_path='' as $$ select learning_private.access(p_action,p_course,p_lesson,p_reflection,p_reviewed) $$;
revoke all on function public.portal_learning_access(text,text,integer,text,boolean) from public,anon;
grant execute on function public.portal_learning_access(text,text,integer,text,boolean) to authenticated;
commit;
