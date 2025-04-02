import { ICourse } from "../../../models/Course";
import { ITask } from "../../../models/Tasks";


export interface ICourseRepository {
  createCourse(courseData: Partial<ICourse>): Promise<ICourse>;
  createTasks(tasksData: Partial<ITask>[]): Promise<ITask[]>;
  getCourseByID(courseId:string):Promise<ICourse|null>
  addStudentToCourse(courseId:string,userId:string):Promise<ICourse|null>
  isUserEnrolled(courseId:string,userId:string):Promise<boolean>
}