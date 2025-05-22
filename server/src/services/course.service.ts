import { inject, injectable } from "inversify";
import { ICourseService } from "../core/interfaces/service/ICourseService";
import { ILesson, ITask } from "../models/Tasks";
import { ICourseRepository } from "../core/interfaces/repository/ICourseRepository";
import { ITaskRepository } from "../core/interfaces/repository/ITaskRepository";
import { TYPES } from "../di/types";
import { ICourse } from "../models/Course";
import { ICoursePurchased } from "../models/CoursePurchased";
import { IPurchasedCourseTask } from "../models/PurchasedCourseTasks";
import { Types } from "mongoose";
import { IPurchasedTaskRepository } from "../core/interfaces/repository/IPurchaseTaskReposioty";
import { IPurchaseCourseRepository } from "../core/interfaces/repository/IPurchasedCourse";

interface IModule {
  title: string;
  description: string;
  video: string;
  lessons: ILesson[];
  duration?: number;
  resources?: string[];
}

// Type for a Lesson within a Module
type Lesson = {
  title: string;
  // Add other lesson fields if needed (e.g., content, duration, etc.)
};

// Type for a Module
type Module = {
  title?: string;
  description?: string;
  video?: string;
  lessons?: Lesson[];
  duration?: string;
  resources?: string[];
};

// Type for courseData
type CourseDataType = {
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  duration: string;
  image: string;
  price: string;
  status: "draft" | "published" | "archived";
  tags?: string[];
  modules?: IModule[];
  learningPoints: string | string[];
  targetedAudience: string | string[];
  courseRequirements: string | string[];
};

injectable();
export class courseService implements ICourseService {
  constructor(
    @inject(TYPES.CourseRepository) private courseRepository: ICourseRepository,
    @inject(TYPES.TaskRepository) private taskRepositoroy: ITaskRepository,
    @inject(TYPES.PurchaseTaskRepository) private purchaseTaskRepository: IPurchasedTaskRepository,
    @inject(TYPES.PurchaseCourseRepository) private purchaseCourseRepository: IPurchaseCourseRepository
  ) {}

  async addCourse(courseData: CourseDataType): Promise<ICourse> {
    

    try {
      const { modules, targetedAudience, learningPoints, courseRequirements, ...courseDetails } = courseData;

      if (
        !courseDetails.title ||
        !courseDetails.description ||
        !courseDetails.category ||
        !courseDetails.level ||
        !courseDetails.duration ||
        !courseDetails.image ||
        !courseDetails.price ||
        !courseDetails.status
      ) {
        throw new Error("Missing required course fields");
      }
      

      const parsedLearningPoints =
        typeof learningPoints === "string" ? JSON.parse(learningPoints) : Array.isArray(learningPoints) ? learningPoints : [];

      const parsedTargetedAudience =
        typeof targetedAudience === "string" ? JSON.parse(targetedAudience) : Array.isArray(targetedAudience) ? targetedAudience : [];

      const parsedCourseRequirements =
        typeof courseRequirements === "string" ? JSON.parse(courseRequirements) : Array.isArray(courseRequirements) ? courseRequirements : [];

      const newCourse = await this.courseRepository.createCourse({
        title: courseDetails.title,
        description: courseDetails.description,
        category: courseDetails.category,
        level: courseDetails.level,
        duration: courseDetails.duration,
        image: courseDetails.image,
        price: courseDetails.price,
        rating: 0,
        enrolledStudents: [],
        status: courseDetails.status,
        tags: courseDetails.tags || [],
        targetedAudience: parsedTargetedAudience,
        learningPoints: parsedLearningPoints,
        courseRequirements: parsedCourseRequirements,
      });

      

      if (modules && Array.isArray(modules) && modules.length > 0) {
        const tasks: Partial<ITask>[] = modules.map((module: IModule, index: number) => ({
          courseId: newCourse._id as Types.ObjectId,
          title: module.title || `Task ${index + 1}`,
          description: module.description || "",
          video: module.video || "",
          lessons: module.lessons ? module.lessons.map((lesson) => lesson.title) : [],
          order: index + 1,
          duration: module.duration?.toString() || newCourse.duration.toString(),
          status: "active" as "active" | "inactive",
          resources: module.resources || [],
        }));

        

        await this.taskRepositoroy.createTasks(tasks);
      }

      return newCourse;
    } catch (error) {
       throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async getCourseById(courseId: string): Promise<ICourse | null> {
    try {
      

      const course = await this.courseRepository.getCourseByID(courseId);

      

      return course;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  //get purcased course for users
  async findCoursePurchaseByUserId(userId: string): Promise<ICoursePurchased[]> {
    return await this.purchaseCourseRepository.findCoursePurchaseByUserId(userId);
  }

  //get purchased course tasks
  async findTaskByUserIdAndCourseId(userId: string, courseId: string): Promise<IPurchasedCourseTask[]> {
    try {
      return await this.purchaseTaskRepository.findTaskByUserIdAndCourseId(userId, courseId);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async getCoursesAdmin(
    search: string,
    category: string,
    status: string,
    page: number,
    limit: number
  ): Promise<{ courses: ICourse[]; total: number }> {
    return await this.courseRepository.getCoursesAdmin(search, category, status, page, limit);
  }

  async updateCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null> {
    return await this.courseRepository.updateCourse(id, data);
  }

  async updateTask(id: string, data: Partial<ITask>): Promise<ITask | null> {
    return await this.taskRepositoroy.updateTask(id, data);
  }

  async deleteTask(id: string): Promise<void> {
    return await this.taskRepositoroy.deleteTask(id);
  }

  async getCourseTasks(courseId: string): Promise<ITask[] | null> {
    return await this.taskRepositoroy.getCourseTasks(courseId);
  }

  //new update course
  async updateCourseAndTasks(courseId: string, courseData: Partial<ICourse>, tasksData: Partial<ITask>[]): Promise<ICourse | null> {
    try {
      const updatedCourse = await this.courseRepository.updateCourse(courseId, courseData);

      if (!updatedCourse) {
        return null;
      }

      const existingTasks = await this.taskRepositoroy.getCourseTasks(courseId);

      

      if (!Array.isArray(tasksData)) {
        throw new Error("tasksData must be an array");
      }

      const incomingTaskIds = tasksData.filter((task) => task._id).map((task) => new Types.ObjectId(task._id as string));

      if (existingTasks) {
        const tasksToDelete = existingTasks.filter((task) => !incomingTaskIds.some((id) => id.equals(task._id as string)));

        for (const task of tasksToDelete) {
          await this.taskRepositoroy.deleteTask(task._id as string);
        }

        for (let index = 0; index < tasksData.length; index++) {
          const taskData = tasksData[index];
          const order = index + 1;
          if (taskData._id) {
            await this.taskRepositoroy.updateTask(taskData._id as string, { ...taskData, order });
          } else {
            const newTask = {
              ...taskData,
              courseId: new Types.ObjectId(courseId),
              order,
              status: taskData.status || "active",
            };
            await this.taskRepositoroy.createTasks([newTask]);
          }
        }
      }

      return updatedCourse;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async findTaskById(taskId: string): Promise<IPurchasedCourseTask | null> {
    return await this.purchaseTaskRepository.findTaskById(taskId)
  }

  async markTaskAsComplete(taskId: string, userId: string): Promise<IPurchasedCourseTask | null> {
    const task = await this.purchaseTaskRepository.findTaskById(taskId);
    if (!task || task.userId.toString() !== userId) {
      throw new Error("Task not found or unauthorized");
    }
    task.completed = true;
    return await task.save();
  }

  async getAllPurchasedCoursesAdmin(page: number, limit: number, search?: string, courseFilter?: string, statusFilter?: string): Promise<{ courses: ICoursePurchased[]; total: number; }> {
    return this.purchaseCourseRepository.findAllCourses(page, limit, search, courseFilter, statusFilter)
  }

 async findCourseById(courseId: string,userId:string): Promise<ICoursePurchased | null> {
      return this.purchaseCourseRepository.findCourseById(courseId,userId)
  }

  async getTopCourses(): Promise<ICourse[]> {
        return this.courseRepository.getTopCourses(3);
  }

  
}
