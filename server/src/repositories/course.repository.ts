 // Adjust the path as needed

import { ICourseRepository } from "../core/interfaces/repository/ICourseRepository";
import { Course, ICourse } from "../models/Course";
import { ITask, Task } from "../models/Tasks";

export class courseRepository implements ICourseRepository {
  // Create a new course
  async createCourse(courseData: Partial<ICourse>): Promise<ICourse> {
    try {
      const newCourse = new Course(courseData);
      await newCourse.save();
      return newCourse;
    } catch (error: any) {
      throw new Error(`Error creating course: ${error.message}`);
    }
  }

  // Create multiple tasks
  async createTasks(tasksData: Partial<ITask>[]): Promise<ITask[]> {
    try {
      const tasks = await Task.insertMany(tasksData) as ITask[]; 
      return tasks;
    } catch (error: any) {
      throw new Error(`Error creating tasks: ${error.message}`);
    }
  }
}