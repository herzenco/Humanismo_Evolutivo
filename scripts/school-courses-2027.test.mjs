import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { schoolCourses, schoolYearSessions } from '../src/data/school-calendar-2027.ts';
import { schoolCoursePreviews } from '../src/data/school-course-previews.ts';

const CREDIT = 'Curso basado en la obra de Luis B. Gómez y de Marcos Constandse.';
const PENDING = ['historia-evolutiva-del-arte', 'historia-de-las-religiones', 'filosofia-para-ninos'];

test('2027 clases copy uses sheet teachers, sessions, credit and the swapped Tuesday times', () => {
  const byId = Object.fromEntries(schoolCourses.map(course => [course.id, course]));
  assert.equal(byId['humanismo-evolutivo-transpersonal'].instructor, 'Aida');
  assert.equal(byId['el-arte-de-ser-empresario'].instructor, 'Ing. Marcos Constandse Madrazo');
  assert.equal(byId['ecologia-y-espiritualidad'].instructor, null);
  assert.equal(byId['introduccion-a-la-antropologia'].instructor, null);
  assert.equal(byId['introduccion-a-la-filosofia'].start, '17:00');
  assert.equal(byId['introduccion-a-la-filosofia'].end, '18:00');
  assert.equal(byId['introduccion-a-la-antropologia'].start, '18:00');
  assert.equal(byId['introduccion-a-la-antropologia'].end, '19:00');
  assert.deepEqual([...byId['introduccion-a-la-filosofia'].days], [2, 4]);
  assert.deepEqual([...byId['introduccion-a-la-antropologia'].days], [2, 4]);
  assert.equal(schoolYearSessions(byId['humanismo-evolutivo-transpersonal'].termSessions), 96);
  assert.equal(schoolYearSessions(byId['introduccion-a-la-filosofia'].termSessions), 67);
  assert.equal(schoolYearSessions(byId['el-arte-de-ser-empresario'].termSessions), 23);
  for (const course of schoolCourses) assert.equal(Boolean(course.classPlanPending), PENDING.includes(course.id));
  assert.equal(schoolCoursePreviews['introduccion-a-la-filosofia'].es.credit, CREDIT);
  assert.equal(schoolCoursePreviews['introduccion-a-la-antropologia'].es.credit, CREDIT);
  assert.equal(schoolCoursePreviews['introduccion-a-la-filosofia'].en.credit, undefined);
  assert.equal(schoolCoursePreviews['humanismo-evolutivo-transpersonal'].es.credit, undefined);
  const overlap = schoolCourses.filter(course => course.days.includes(6) && course.start === '10:00' && course.end === '11:00');
  assert.deepEqual(overlap.map(course => course.id), ['historia-de-las-religiones', 'filosofia-para-ninos']);
});

test('portal lesson text spells Aida and the clases pages do not link Drive', async () => {
  const lessons = await readFile(new URL('../src/generated/course-content.json', import.meta.url), 'utf8');
  assert.equal(lessons.includes('Aída'), false);
  assert.equal(lessons.split('Aida Sida').length - 1, 3);
  const listing = await readFile(new URL('../src/app/[lang]/clases/page.tsx', import.meta.url), 'utf8');
  const detail = await readFile(new URL('../src/app/[lang]/clases/[courseSlug]/page.tsx', import.meta.url), 'utf8');
  assert.match(listing, /Docente por confirmar/);
  assert.match(listing, /Plan de clases pendiente/);
  assert.match(detail, /preview\.credit/);
  assert.equal(listing.includes('drive.google'), false);
  assert.equal(detail.includes('drive.google'), false);
});
