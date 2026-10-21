import { z } from 'zod';
export const teacherDashboardRequest = z.object({ schoolId:z.uuid(), query:z.string().trim().max(200).default(''), limit:z.number().int().min(1).max(100).default(25), offset:z.number().int().min(0).max(100000).default(0) }).strict();
export type TeacherDashboardRequest = z.infer<typeof teacherDashboardRequest>;
export type TeacherStudent = { userId:string; displayName:string|null; email:string|null; attendedSessions:number; absentSessions:number; courses:{courseId:string;total:number;completed:number}[] };
export type TeacherOverview = {schoolId:string;schoolName:string;studentCount:number;matchedCount:number;completedLessons:number;finishedCourses:number;attendedSessions:number;students:TeacherStudent[]};
