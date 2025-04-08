 // Adjust the path as needed

import mongoose from "mongoose";
import { ICourseRepository } from "../core/interfaces/repository/ICourseRepository";
import { Course, ICourse } from "../models/Course";
import { ITask, Task } from "../models/Tasks";
import { CoursePurchased, ICoursePurchased } from "../models/CoursePurchased";

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

  //get user purchased courses
  async findCoursePurchaseByUserId(userId: string): Promise<ICoursePurchased[]> {
      return CoursePurchased.find({userId}).exec()
  }


 async getCoursesAdmin(search: string, category: string, status: string, page: number, limit: number): Promise<{ courses: ICourse[]; total: number; }> {
  const query: any = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (category && category !== 'all') {
    query.category = category;
  }

  if (status && status !== 'all') {
    query.status = status;
  }

  const courses=await Course.find(query).skip((page-1)*limit).limit(limit)
  const total=await Course.countDocuments(query)
  return {courses,total}
 }

async updateCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null> {
  return await Course.findByIdAndUpdate(id, data, { new: true });
}

}