import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { studentOverview } from '../src/lib/learning/overview.ts';
import { filterSchedule, groupSchedule, scheduleDate, scheduleTime } from '../src/lib/portal-schedule.ts';
import { portalClasses } from '../src/data/portal.ts';
const catalog = JSON.parse(await readFile(new URL('../src/generated/course-catalog.json', import.meta.url), 'utf8'));
test('dashboard keeps teacher attendance separate from completed online lessons',()=>{
 const attendance={presentSessions:3,presentCourses:1,courses:[{courseId:'filosofia-de-yo-soy-nosotros',title:'Yo soy nosotros',present:3,absent:1}]};
 const result=studentOverview({'yo-soy-nosotros':2,'el-arte-de-ser-empresario':11},attendance,catalog);
 assert.equal(result.completedLessons,13);assert.equal(result.onlineCourses,2);assert.equal(result.finishedCourses,1);
 assert.equal(result.courses[0].attended,3);assert.equal(result.courses[0].percent,4);
 assert.equal(result.courses[3].percent,100);assert.equal(result.courses[3].attended,0);
 const unavailable=studentOverview(null,null,catalog);assert.equal(unavailable.completedLessons,null);assert.equal(unavailable.courses[0].attended,null);
 const empty=studentOverview({}, {presentSessions:0,presentCourses:0,courses:[]},catalog);assert.equal(empty.completedLessons,0);assert.equal(empty.onlineCourses,0);
});
test('schedule search is accent-insensitive, intersects course filters and groups repeated titles',()=>{
 const all=filterSchedule(portalClasses);
 assert.equal(all.length,23);assert.equal(groupSchedule(all).length,10);
 assert.equal(filterSchedule(portalClasses,'ecologia').length,3);
 assert.equal(filterSchedule(portalClasses,'ECOLOGÍA','ecologia-y-espiritualidad').length,3);
 assert.equal(filterSchedule(portalClasses,'ecologia','el-arte-de-ser-empresario').length,0);
 assert.equal(filterSchedule(portalClasses,'no existe').length,0);
 assert.ok(filterSchedule(portalClasses,'16 de febrero').length>0);
 assert.equal(scheduleTime(portalClasses[0]),'11:00');assert.equal(scheduleTime(portalClasses[0],true),'13:00');
 assert.match(scheduleDate(portalClasses[0]),/15 de febrero de 2027/);
});
