import { ICourse } from "../../../models/Course";
import { ICoursePurchased } from "../../../models/CoursePurchased";
import { ITask } from "../../../models/Tasks";


export interface ICourseRepository {
  createCourse(courseData: Partial<ICourse>): Promise<ICourse>;
  // createTasks(tasksData: Partial<ITask>[]): Promise<ITask[]>;
  getCourseByID(courseId:string):Promise<ICourse|null>
  addStudentToCourse(courseId:string,userId:string):Promise<ICourse|null>
  isUserEnrolled(courseId:string,userId:string):Promise<boolean>
  // findCoursePurchaseByUserId(userId: string): Promise<ICoursePurchased[]>
  getCoursesAdmin(search: string,category: string,status: string,page: number,limit: number): Promise<{ courses: ICourse[]; total: number }>
  updateCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null> 
  getAllCourses(): Promise<ICourse[] | null>
}