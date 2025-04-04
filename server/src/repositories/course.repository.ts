 // Adjust the path as needed

import mongoose from "mongoose";
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

  //get course by id
  async getCourseByID(courseId: string): Promise<ICourse|null> {
      try {
        console.log(courseId,"getcourserby id repository");
        
        const course=await Course.findById(courseId)

        console.log('course from getcourse by id',course);
        
        return course
      } catch (error:any) {
        throw new Error(`Error fetching course: ${error.message}`);
      }
  }

//add student id into course enrollment
  async addStudentToCourse(courseId: string, userId: string): Promise<ICourse | null> {
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    return await Course.findByIdAndUpdate(
      courseObjectId,
      { $addToSet: { enrolledStudents: userObjectId } },
      { new: true }
    );
  }


  //check student alredy in course
   async isUserEnrolled(courseId: string, userId: string): Promise<boolean> {
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const course = await Course.findOne({
      _id: courseObjectId,
      enrolledStudents: userObjectId
    });

    return !!course;
  }



}