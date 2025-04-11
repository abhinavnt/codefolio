import mongoose from "mongoose";
import { BaseRepository } from "../core/abstracts/base.repository";
import { ITaskRepository } from "../core/interfaces/repository/ITaskRepository";
import { IPurchasedCourseTask, PurchasedCourseTasks } from "../models/PurchasedCourseTasks";
import { ITask, Task } from "../models/Tasks";




export class TaskRepository extends BaseRepository<ITask> implements ITaskRepository{
constructor(){
  super(Task)
}

  async createTasks(tasksData: Partial<ITask>[]): Promise<ITask[]> {
    try {
      const tasks = await Task.insertMany(tasksData) as ITask[]; 
      return tasks;
    } catch (error: any) {
      throw new Error(`Error creating tasks: ${error.message}`);
    }
  }

 async getCourseTasks(courseId: string): Promise<ITask[] | null> {
     return await this.find({courseId})
 }

 async updateTask(id: string, data: Partial<ITask>): Promise<ITask | null> {
    return await this.findByIdAndUpdate(new mongoose.Types.ObjectId(id), data, { new: true });
  }

  async deleteTask(id: string): Promise<void> {
    await this.findByIdAndDelete(id);
  }

}



