import { IPurchasedCourseTask } from "../../../models/PurchasedCourseTasks";








export interface IPurchasedTaskRepository{
    findTaskByUserIdAndCourseId(userId: string, courseId: string): Promise<IPurchasedCourseTask[]>
    savePurchasedTasks(tasks: Partial<IPurchasedCourseTask>[]): Promise<IPurchasedCourseTask[]>
    findTaskById(taskId: string): Promise<IPurchasedCourseTask | null>
    findByUserIdandTaskId(userId:string,taskId:string):Promise<IPurchasedCourseTask|null>
    updateByUserIdAndTaskId(userId: string,
        taskId: string,
        update: { $set?: Partial<IPurchasedCourseTask>; $push?: { attempts: { submissionDate: Date; startTime: string; endTime: string,reviewDate:string } } }
      ): Promise<IPurchasedCourseTask | null>
}