import type { AttendanceSummary } from '../attendance/contracts';
export function studentOverview(progress: Record<string, number> | null, attendance: AttendanceSummary | null, catalog: {id:string;title:string;description:string;minutes:number;lessons:{id:string;title:string}[]}[]) {
 const courses = catalog.map(course => {
  const completed = progress ? Math.min(course.lessons.length, Math.max(0, Number(progress[course.id]) || 0)) : null;
  const attended = attendance ? attendance.courses.filter(item => (item.courseId === 'filosofia-de-yo-soy-nosotros' ? 'yo-soy-nosotros' : item.courseId) === course.id).reduce((sum,item) => sum + item.present, 0) : null;
  return { ...course, completed, attended, percent: completed === null ? null : Math.round(completed / course.lessons.length * 100) };
 });
 return {
  courses,
  completedLessons: progress ? courses.reduce((sum,c) => sum + (c.completed || 0), 0) : null,
  onlineCourses: progress ? courses.filter(c => (c.completed || 0) > 0).length : null,
  finishedCourses: progress ? courses.filter(c => c.completed === c.lessons.length).length : null,
 };
}
