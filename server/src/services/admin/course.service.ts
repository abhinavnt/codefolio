import { Types } from "mongoose"; // Import Types for ObjectId
import { ICourseService } from "../../core/interfaces/service/ICourseService"; // Adjust the path as needed
import { ICourse } from "../../models/Course"; // Adjust the path as needed
 // Adjust the path as needed
import { courseRepository } from "../../repositories/course.repository"; // Adjust the path as needed
import { ILesson, ITask } from "../../models/Tasks";

const CourseRepository = new courseRepository();

// Define the structure of a module from the request body
interface IModule {
  title: string;
  description: string;
  video: string;
  lessons: ILesson[]; // Use ILesson from task.model.ts
  duration?: number;
  resources?: string[];
}

export class courseService implements ICourseService {
  async addCourse(courseData: any): Promise<ICourse> {
    console.log('add course service kayritund');
    
    try {
      const { modules, ...courseDetails } = courseData;

      // Validate required fields for the course
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

      // Create the course
      const newCourse = await CourseRepository.createCourse({
        title: courseDetails.title,
        description: courseDetails.description,
        category: courseDetails.category,
        level: courseDetails.level,
        duration: courseDetails.duration,
        image: courseDetails.image,
        price: courseDetails.price,
        rating: 0, // Default value
        enrolledStudents: [], // Default empty array
        status: "draft", // Default value
        tags: courseDetails.tags || [], // Optional field
      });

      console.log(modules,"modules");
      
      // If there are modules, create tasks for each module
      console.log(Array.isArray(modules),'arry ano modules');
      console.log(modules.length,'module length');
      
      if (modules && Array.isArray(modules) && modules.length > 0) {
        const tasks: Partial<ITask>[] = modules.map(
          (module: IModule, index: number) => ({
            courseId: newCourse._id as Types.ObjectId,
            title: module.title || `Task ${index + 1}`,
            description: module.description || "",
            video: module.video || "",
            lessons: module.lessons ? module.lessons.map(lesson => lesson.title) : [], // Transform to array of strings
            order: index + 1,
            duration: module.duration?.toString() || newCourse.duration.toString(),
            status: "active" as "active" | "inactive",
            resources: module.resources || [],
          })
        );

        // Save all tasks
        console.log('waiting for tasks creation');
        
        await CourseRepository.createTasks(tasks);
      }

      return newCourse;
    } catch (error: any) {
      throw new Error(`Error creating course and tasks: ${error.message}`);
    }
  }
}