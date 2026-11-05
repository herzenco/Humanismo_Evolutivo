-- Dev named this responsibility "school". Codex names it school_admin.
-- Rename any existing rows before portal_roles_infrastructure tightens the check.
alter table education_qa_private.memberships drop constraint memberships_role_check;
update education_qa_private.memberships set role = 'school_admin' where role = 'school';
alter table education_qa_private.memberships add constraint memberships_role_check check (role in ('student', 'teacher', 'school', 'school_admin'));
