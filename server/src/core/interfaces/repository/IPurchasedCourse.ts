import { ICoursePurchased } from "../../../models/CoursePurchased";







export interface IPurchaseCourseRepository{
    findCoursePurchaseByUserId(userId: string): Promise<ICoursePurchased[]>
}