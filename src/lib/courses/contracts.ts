import { z } from 'zod';
export type LearningCourse = {id:string;title:string;description:string;minutes:number;lessons:{id:string;title:string}[]};
const id=z.string().min(1).max(100).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);
const operation=<A extends string,S extends z.ZodType>(action:A,input:S)=>z.object({action:z.literal(action),input}).strict();
export const courseRequestSchema=z.discriminatedUnion('action',[
 operation('manage',z.object({}).strict()),
 operation('create',z.object({courseId:id,title:z.string().trim().min(1).max(200),description:z.string().max(2000),minutes:z.number().int().min(1).max(600)}).strict()),
 operation('lesson.save',z.object({courseId:id,lesson:z.number().int().min(1).max(500),title:z.string().trim().min(1).max(200),sections:z.array(z.object({title:z.string().trim().min(1).max(200),text:z.string().trim().min(1).max(20000)}).strict()).min(1).max(30)}).strict()),
 operation('publish',z.object({courseId:id}).strict()),
]);
export type CourseRequest=z.infer<typeof courseRequestSchema>;

export const lessonContentSchema=z.object({id:z.string(),title:z.string(),sections:z.array(z.object({title:z.string(),text:z.string()}))});
