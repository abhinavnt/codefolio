import mongoose from "mongoose";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IPurchasedTaskRepository } from "../core/interfaces/repository/IPurchaseTaskReposioty";
import { IPurchasedCourseTask, PurchasedCourseTasks } from "../models/PurchasedCourseTasks";

export class PurchaseTaskRepository extends BaseRepository<IPurchasedCourseTask> implements IPurchasedTaskRepository {
  constructor() {
    super(PurchasedCourseTasks);
  }

  async findTaskByUserIdAndCourseId(userId: string, courseId: string): Promise<IPurchasedCourseTask[]> {
    return this.find({ userId, courseId }).sort({ order: 1 }).exec();
  }

  async savePurchasedTasks(tasks: Partial<IPurchasedCourseTask>[]): Promise<IPurchasedCourseTask[]> {
    return (await PurchasedCourseTasks.insertMany(tasks)) as IPurchasedCourseTask[];
  }

  async findTaskById(taskId: string): Promise<IPurchasedCourseTask | null> {
    return this.findById(new mongoose.Types.ObjectId(taskId))
  }

  async findByUserIdandTaskId(userId: string, taskId: string): Promise<IPurchasedCourseTask | null> {
      return this.findOne({userId,_id:taskId})
  }

  async updateByUserIdAndTaskId(userId: string, taskId: string, update: { $set?: Partial<IPurchasedCourseTask>; $push?: { attempts: { submissionDate: Date; startTime: string; endTime: string;reviewDate:string }; }; }): Promise<IPurchasedCourseTask | null> {
    const updatedTask = await this.findOneAndUpdate(
      { userId, _id: taskId },
      update,
      { new: true }
    );

    return updatedTask;
  }

  
}
