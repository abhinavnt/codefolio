import { IPurchasedCourseTask } from "../../../models/PurchasedCourseTasks";
import { ITask } from "../../../models/Tasks";





export interface ITaskRepository{
    getCourseTasks(courseId:string):Promise<ITask[]|null>
    findTaskByUserIdAndCourseId(userId: string, courseId: string): Promise<IPurchasedCourseTask[]>
}