import { ITaskRepository } from "../core/interfaces/repository/ITaskRepository";
import { ITask, Task } from "../models/Tasks";




export class TaskRepository implements ITaskRepository{

 async getCourseTasks(courseId: string): Promise<ITask[] | null> {
     return await Task.find({courseId})
 }

}



