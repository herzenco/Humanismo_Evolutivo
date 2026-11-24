import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import catalog from '../src/generated/course-catalog.json' with { type: 'json' };
import { schoolBreak, schoolCourses, schoolHolidays, schoolTerms, schoolYearSessions } from '../src/data/school-calendar-2027.ts';
import { schoolCoursePreviews } from '../src/data/school-course-previews.ts';
import { coursePayload } from '../src/lib/qa-resource-contract.ts';

const CREDIT = 'Curso basado en la obra de Luis B. Gómez y de Marcos Constandse.';
const PLAN_PENDING = ['historia-evolutiva-del-arte', 'historia-de-las-religiones', 'filosofia-para-ninos'];
const CREDITS = ['introduccion-a-la-filosofia', 'introduccion-a-la-antropologia'];
const YEAR_SESSIONS = {
  'humanismo-evolutivo-transpersonal': 96,
  'yo-soy-nosotros': 96,
  'ecologia-y-espiritualidad': 96,
  'introduccion-a-la-filosofia': 67,
  'introduccion-a-la-antropologia': 67,
  'historia-evolutiva-del-arte': 67,
  'el-arte-de-ser-empresario': 23,
  'historia-de-las-religiones': 23,
  'filosofia-para-ninos': 23,
};
const INSTRUCTORS = {
  'humanismo-evolutivo-transpersonal': 'Aida',
  'yo-soy-nosotros': 'Olimpia',
  'ecologia-y-espiritualidad': null,
  'introduccion-a-la-filosofia': 'Olimpia',
  'introduccion-a-la-antropologia': null,
  'historia-evolutiva-del-arte': 'Alex',
  'el-arte-de-ser-empresario': 'Ing. Marcos Constandse Madrazo',
  'historia-de-las-religiones': 'Alex',
  'filosofia-para-ninos': 'Olimpia',
};

test('2027 courses keep sheet order, teachers, year totals and the Saturday overlap', () => {
  assert.deepEqual(schoolCourses.map(course => course.id), Object.keys(YEAR_SESSIONS));
  assert.equal(JSON.stringify(schoolCourses).includes('Aída'), false);
  assert.equal(JSON.stringify(schoolCourses).includes('"MCM"'), false);
  for (const course of schoolCourses) {
    assert.equal(course.instructor, INSTRUCTORS[course.id]);
    assert.equal(schoolYearSessions(course.termSessions), YEAR_SESSIONS[course.id]);
    assert.equal(Boolean(course.classPlanPending), PLAN_PENDING.includes(course.id));
    assert.match(course.start, /^(?:[01]\d|2[0-3]):[0-5]\d$/);
    assert.match(course.end, /^(?:[01]\d|2[0-3]):[0-5]\d$/);
    assert.equal(course.preview, undefined);
  }
  const overlap = schoolCourses.filter(course => course.days.includes(6) && course.start === '10:00' && course.end === '11:00');
  assert.deepEqual(overlap.map(course => course.id), ['historia-de-las-religiones', 'filosofia-para-ninos']);
  assert.equal(schoolCourses.find(course => course.id === 'yo-soy-nosotros').title.includes('“Yo soy nosotros”'), true);
  assert.deepEqual(schoolTerms.map(term => [term.start, term.end]), [
    ['2027-02-16', '2027-06-15'],
    ['2027-08-16', '2027-12-15'],
  ]);
  assert.deepEqual(schoolBreak, { start: '2027-03-22', end: '2027-03-27' });
  assert.deepEqual([...schoolHolidays], ['2027-03-15', '2027-05-01', '2027-09-16', '2027-10-15', '2027-11-15']);
});

test('Spanish previews supply every card summary, and the Gómez credit stays on two courses', () => {
  for (const course of schoolCourses) {
    const preview = schoolCoursePreviews[course.id];
    assert.equal(typeof preview.es.summary, 'string');
    assert.ok(preview.es.summary.length > 40, course.id);
  }
  for (const online of catalog) {
    const preview = schoolCoursePreviews[online.id];
    assert.ok(preview);
    assert.notEqual(preview.es.summary, online.description);
  }
  for (const [id, preview] of Object.entries(schoolCoursePreviews)) {
    if (CREDITS.includes(id)) {
      assert.equal(preview.es.credit, CREDIT);
      assert.equal(preview.en.credit, undefined);
    } else {
      assert.equal(preview.es.credit, undefined);
      assert.equal(preview.en.credit, undefined);
    }
  }
  const bundled = JSON.stringify({ schoolCourses, schoolCoursePreviews });
  assert.equal(bundled.includes('drive.google'), false);
  assert.equal(bundled.includes('docs.google'), false);
  assert.equal(bundled.includes('Aída'), false);
});

test('clase payloads accept the new optional fields and still accept the previous shape', () => {
  for (const course of schoolCourses) {
    const payload = {
      title: course.title,
      instructor: course.instructor,
      days: [...course.days],
      start: course.start,
      end: course.end,
      termSessions: [course.termSessions[0], course.termSessions[1]],
      ...(course.classPlanPending ? { classPlanPending: true } : {}),
      preview: schoolCoursePreviews[course.id],
    };
    const parsed = coursePayload.safeParse(payload);
    assert.equal(parsed.success, true, course.id);
    if (parsed.success && CREDITS.includes(course.id)) assert.equal(parsed.data.preview.es.credit, CREDIT);
  }
  const legacy = coursePayload.safeParse({
    title: 'Introducción a la Filosofía',
    instructor: 'Olimpia',
    days: [2, 4],
    start: '18:00',
    end: '19:00',
    termSessions: [33, 34],
    preview: {
      es: { summary: 'Resumen', title: 'Clase', lesson: 'Lección de muestra', exercise: 'Ejercicio' },
      en: { summary: 'Summary', title: 'Class', lesson: 'Sample lesson', exercise: 'Exercise' },
    },
  });
  assert.equal(legacy.success, true);
  assert.equal(coursePayload.safeParse({
    title: 'Historia Evolutiva del Arte',
    instructor: 'Alex',
    days: [2, 4],
    start: '16:00',
    end: '17:00',
    termSessions: [33, 34],
    classPlanPending: true,
    driveUrl: 'https://drive.google.com/drive/folders/example',
    preview: {
      es: { summary: 'Resumen', title: 'Clase', lesson: 'Lección de muestra', exercise: 'Ejercicio' },
      en: { summary: 'Summary', title: 'Class', lesson: 'Sample lesson', exercise: 'Exercise' },
    },
  }).success, false);
});

test('clases pages render sheet copy instead of catalog blurbs or Drive links', async () => {
  const listing = await readFile(new URL('../src/app/[lang]/clases/page.tsx', import.meta.url), 'utf8');
  const detail = await readFile(new URL('../src/app/[lang]/clases/[courseSlug]/page.tsx', import.meta.url), 'utf8');
  for (const source of [listing, detail]) {
    assert.equal(source.includes('online.description'), false);
    assert.equal(source.includes('online.lessons'), false);
    assert.equal(source.includes('Aída'), false);
    assert.equal(source.includes('drive.google'), false);
    assert.equal(source.includes('docs.google'), false);
  }
  assert.match(listing, /schoolYearSessions/);
  assert.match(listing, /Docente por confirmar/);
  assert.match(listing, /Plan de clases pendiente/);
  assert.match(detail, /preview\.credit/);
  assert.match(detail, /Docente por confirmar/);
  assert.match(detail, /Plan de clases pendiente/);
  assert.equal(listing.includes(CREDIT), false);
});
