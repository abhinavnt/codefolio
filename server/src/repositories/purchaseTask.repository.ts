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
}
