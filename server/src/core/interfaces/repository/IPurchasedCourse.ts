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
}
