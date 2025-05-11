import { ICoursePurchased } from "../../../models/CoursePurchased";

export interface IPurchaseCourseRepository {
  findCoursePurchaseByUserId(userId: string): Promise<ICoursePurchased[]>;
  findAllCourses(
    page: number,
    limit: number,
    search?: string,
    courseFilter?: string,
    statusFilter?: string
  ): Promise<{ courses: ICoursePurchased[]; total: number }>;
  findCourseById(courseId:string,userId:string):Promise<ICoursePurchased|null>
  getDashboardCompletedCourses(): Promise<number>
  getCoursesPurchasedCount(userId: string, period: "daily" | "weekly" | "monthly" | "yearly" | "all"): Promise<number>
  getCompletedCoursesCount(userId: string, period: "daily" | "weekly" | "monthly" | "yearly" | "all"): Promise<number>
}
