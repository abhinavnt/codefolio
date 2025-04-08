import { ITaskRepository } from "../core/interfaces/repository/ITaskRepository";
import { IPurchasedCourseTask, PurchasedCourseTasks } from "../models/PurchasedCourseTasks";
import { ITask, Task } from "../models/Tasks";




export class TaskRepository implements ITaskRepository{

 async getCourseTasks(courseId: string): Promise<ITask[] | null> {
     return await Task.find({courseId})
 }


 async findTaskByUserIdAndCourseId(userId: string, courseId: string): Promise<IPurchasedCourseTask[]> {
     return PurchasedCourseTasks.find({userId,courseId}).sort({order:1}).exec()
 }

 async updateTask(id: string, data: Partial<ITask>): Promise<ITask | null> {
    return await Task.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteTask(id: string): Promise<void> {
    await Task.findByIdAndDelete(id);
  }

}



