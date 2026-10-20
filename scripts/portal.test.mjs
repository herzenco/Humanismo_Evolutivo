import test from 'node:test';
import assert from 'node:assert/strict';
import { classDateKey, classesForMonth, portalCourses, portalClasses, portalScheduleCourses } from '../src/data/portal.ts';

const session = (id, startsAt, timeZone = 'America/Cancun') => ({ id, courseId: 'test-course', title: 'Class', startsAt, endsAt: startsAt, timeZone });

test('classes are assigned to the date in their scheduled timezone, including month boundaries', () => {
  const late = session('late', '2026-11-01T02:00:00Z');
  assert.equal(classDateKey(late), '2026-10-31');
  assert.deepEqual(classesForMonth([late], 2026, 9), [late]);
  assert.deepEqual(classesForMonth([late], 2026, 10), []);
});

test('calendar and list share a chronological class collection across years', () => {
  const first = session('first', '2027-01-01T15:00:00Z');
  const last = session('last', '2027-01-31T16:00:00Z');
  const old = session('old', '2026-01-01T15:00:00Z');
  assert.deepEqual(classesForMonth([last, old, first], 2027, 0).map(item => item.id), ['first', 'last']);
});

test('course and class catalogs contain only supplied educational content', () => {
  const courses = new Set([...portalCourses, ...portalScheduleCourses].map(course => course.id));
  assert.equal(courses.size, portalCourses.length + portalScheduleCourses.length);
  assert.equal(portalClasses.length, 23);
  for (const item of portalClasses) {
    assert.ok(courses.has(item.courseId));
    assert.ok(Date.parse(item.endsAt) > Date.parse(item.startsAt));
    assert.match(classDateKey(item), /^\d{4}-\d{2}-\d{2}$/);
  }
});
