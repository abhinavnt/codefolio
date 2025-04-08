import { ICourse } from "../../../models/Course";
import { ICoursePurchased } from "../../../models/CoursePurchased";
import { IPurchasedCourseTask } from "../../../models/PurchasedCourseTasks";
import { ITask } from "../../../models/Tasks";

export interface ICourseService {
  addCourse(courseData: any): Promise<ICourse>;
  getCourseById(courseId:string):Promise<ICourse|null>
  findCoursePurchaseByUserId(userId: string): Promise<ICoursePurchased[]>
  findTaskByUserIdAndCourseId(userId: string, courseId: string): Promise<IPurchasedCourseTask[]>
  getCoursesAdmin(search: string,category: string,status: string,page: number,limit: number): Promise<{ courses: ICourse[]; total: number }>
  updateCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null>
  updateTask(id: string, data: Partial<ITask>): Promise<ITask | null>
  deleteTask(id: string): Promise<void> 
  getCourseTasks(courseId:string):Promise<ITask[]|null>

}