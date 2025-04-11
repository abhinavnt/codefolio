import { IPurchasedCourseTask } from "../../../models/PurchasedCourseTasks";








export interface IPurchasedTaskRepository{
    findTaskByUserIdAndCourseId(userId: string, courseId: string): Promise<IPurchasedCourseTask[]>
    savePurchasedTasks(tasks: Partial<IPurchasedCourseTask>[]): Promise<IPurchasedCourseTask[]>
}