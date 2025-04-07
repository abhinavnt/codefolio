import { ICourse } from "../../../models/Course";
import { ICoursePurchased } from "../../../models/CoursePurchased";
import { IPurchasedCourseTask } from "../../../models/PurchasedCourseTasks";

export interface ICourseService {
  addCourse(courseData: any): Promise<ICourse>;
  getCourseById(courseId:string):Promise<ICourse|null>
  findCoursePurchaseByUserId(userId: string): Promise<ICoursePurchased[]>
  findTaskByUserIdAndCourseId(userId: string, courseId: string): Promise<IPurchasedCourseTask[]>
}