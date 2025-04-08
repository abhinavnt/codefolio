import { Types } from "mongoose"; 
import { ICourseService } from "../../core/interfaces/service/ICourseService"; 
import { ICourse } from "../../models/Course"; 
import { courseRepository } from "../../repositories/course.repository"; 
import { ILesson, ITask } from "../../models/Tasks";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { ICourseRepository } from "../../core/interfaces/repository/ICourseRepository";
import { ICoursePurchased } from "../../models/CoursePurchased";
import { ITaskRepository } from "../../core/interfaces/repository/ITaskRepository";
import { IPurchasedCourseTask } from "../../models/PurchasedCourseTasks";


interface IModule {
  title: string;
  description: string;
  video: string;
  lessons: ILesson[]; 
  duration?: number;
  resources?: string[];
}

injectable()
export class courseService implements ICourseService {
   
  constructor(@inject(TYPES.CourseRepository) private courseRepository:ICourseRepository,
              @inject(TYPES.TaskRepository) private taskRepositoroy:ITaskRepository
){}

  async addCourse(courseData: any): Promise<ICourse> {
    console.log('add course service kayritund');
    
    try {
      const { modules, targetedAudience,learningPoints,courseRequirements,...courseDetails} = courseData;

      if (
        !courseDetails.title ||
        !courseDetails.description ||
        !courseDetails.category ||
        !courseDetails.level ||
        !courseDetails.duration ||
        !courseDetails.image ||
        !courseDetails.price
      ) {
        throw new Error("Missing required course fields");
      }
      console.log(courseDetails,"course details");

        const parsedLearningPoints = typeof learningPoints === 'string' 
        ? JSON.parse(learningPoints) 
        : Array.isArray(learningPoints) 
        ? learningPoints 
        : [];
      
      const parsedTargetedAudience = typeof targetedAudience === 'string'
        ? JSON.parse(targetedAudience)
        : Array.isArray(targetedAudience)
        ? targetedAudience
        : [];
      
      const parsedCourseRequirements = typeof courseRequirements === 'string'
        ? JSON.parse(courseRequirements)
        : Array.isArray(courseRequirements)
        ? courseRequirements
        : [];
      
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
        status: "draft",
        tags: courseDetails.tags || [], 
        targetedAudience:parsedTargetedAudience,
        learningPoints:parsedLearningPoints,
        courseRequirements:parsedCourseRequirements
      });

      console.log(modules,"modules");
      
      console.log(Array.isArray(modules),'arry ano modules');
      console.log(modules.length,'module length');
      
      if (modules && Array.isArray(modules) && modules.length > 0) {
        const tasks: Partial<ITask>[] = modules.map(
          (module: IModule, index: number) => ({
            courseId: newCourse._id as Types.ObjectId,
            title: module.title || `Task ${index + 1}`,
            description: module.description || "",
            video: module.video || "",
            lessons: module.lessons ? module.lessons.map(lesson => lesson.title) : [],
            order: index + 1,
            duration: module.duration?.toString() || newCourse.duration.toString(),
            status: "active" as "active" | "inactive",
            resources: module.resources || [],
          })
        );

        console.log('waiting for tasks creation');
        
        await this.courseRepository.createTasks(tasks);
      }

      return newCourse;
    } catch (error: any) {
      throw new Error(`Error creating course and tasks: ${error.message}`);
    }
  }

  async getCourseById(courseId: string): Promise<ICourse | null> {
      try {
        console.log('get course by id serviceil ethitunf ');
        
        const course= await this.courseRepository.getCourseByID(courseId)

        console.log(course,"course response from getcourseby id service");
        
        return course
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
      }
  }



  //get purcased course for users
  async findCoursePurchaseByUserId(userId: string): Promise<ICoursePurchased[]> {
      return await this.courseRepository.findCoursePurchaseByUserId(userId) 
  }



  //get purchased course tasks
  async findTaskByUserIdAndCourseId(userId: string, courseId: string): Promise<IPurchasedCourseTask[]> {
    try {
      
      return await this.taskRepositoroy.findTaskByUserIdAndCourseId(userId,courseId)
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }




  //admin
   async getCoursesAdmin(search: string, category: string, status: string, page: number, limit: number): Promise<{ courses: ICourse[]; total: number; }> {
      return await this.courseRepository.getCoursesAdmin(search,category,status,page,limit)
  }

  async updateCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null> {
    return await this.courseRepository.updateCourse(id, data);
  }

  async updateTask(id: string, data: Partial<ITask>): Promise<ITask | null> {
    return await this.taskRepositoroy.updateTask(id, data);
  }

  async deleteTask(id: string): Promise<void> {
    return await this.taskRepositoroy.deleteTask(id)
  }

  async getCourseTasks(courseId: string): Promise<ITask[] | null> {
      return await this.taskRepositoroy.getCourseTasks(courseId)
  }



}