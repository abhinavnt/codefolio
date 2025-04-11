import { IPurchasedCourseTask } from "../../../models/PurchasedCourseTasks";
import { ITask } from "../../../models/Tasks";





export interface ITaskRepository{
    getCourseTasks(courseId:string):Promise<ITask[]|null>
    // findTaskByUserIdAndCourseId(userId: string, courseId: string): Promise<IPurchasedCourseTask[]>
    updateTask(id: string, data: Partial<ITask>): Promise<ITask | null>
    deleteTask(id: string): Promise<void>
    createTasks(tasksData: Partial<ITask>[]): Promise<ITask[]>
    
}