import mongoose, { FilterQuery } from "mongoose";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IPurchaseCourseRepository } from "../core/interfaces/repository/IPurchasedCourse";
import { CoursePurchased, ICoursePurchased } from "../models/CoursePurchased";
import { getDateRange } from "../utils/dateUtils";

export class PurchaseCourseRepository extends BaseRepository<ICoursePurchased> implements IPurchaseCourseRepository {
  constructor() {
    super(CoursePurchased);
  }
  async findCoursePurchaseByUserId(userId: string): Promise<ICoursePurchased[]> {
    return CoursePurchased.find({ userId }).exec();
  }

  async findAllCourses(
    page: number,
    limit: number,
    search?: string,
    courseFilter?: string,
    statusFilter?: string
  ): Promise<{ courses: ICoursePurchased[]; total: number }> {


    const query: FilterQuery<ICoursePurchased> = {}
    
    if (search) {
      query.$or = [
        { "courseData.title": { $regex: search, $options: "i" } },
        { "userId.email": { $regex: search, $options: "i" } },
      ];
    }

    if (courseFilter && courseFilter !== "all") {
      query["courseData.title"] = { $regex: courseFilter, $options: "i" };
    }

    if (statusFilter && statusFilter !== "all") {
      query["courseData.status"] = statusFilter;
    }

    const total= await  this.countDocuments(query)
    const courses= await this.find(query).populate("userId","name email").skip((page-1)*limit).limit(limit).lean<ICoursePurchased[]>()

    return {courses,total}



  }

  async findCourseById(courseId: string, userId: string): Promise<ICoursePurchased | null> {
    return await this.findOne({
        courseId: new mongoose.Types.ObjectId(courseId),
        userId: new mongoose.Types.ObjectId(userId)
    });
}

//dashboard

//admin
async getDashboardCompletedCourses(): Promise<number> {
  return this.countDocuments({ completed: true });
}

//user
 async getCoursesPurchasedCount(userId: string, period: "daily" | "weekly" | "monthly" | "yearly" | "all"): Promise<number> {
    const query: any = { userId };
    
    if (period !== "all") {
      const { startDate, endDate } = getDateRange(period);
      query.createdAt = { $gte: startDate, $lte: endDate };
    }

    return this.countDocuments(query);
  }

  async getCompletedCoursesCount(userId: string, period: "daily" | "weekly" | "monthly" | "yearly" | "all"): Promise<number> {
    // Assuming all purchased courses are completed for simplicity
    const query: any = { userId };
    
    if (period !== "all") {
      const { startDate, endDate } = getDateRange(period);
      query.createdAt = { $gte: startDate, $lte: endDate };
    }

    return this.countDocuments(query);
  }

}
