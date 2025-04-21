 // Adjust the path as needed

import mongoose from "mongoose";
import { ICourseRepository } from "../core/interfaces/repository/ICourseRepository";
import { Course, ICourse } from "../models/Course";
import { BaseRepository } from "../core/abstracts/base.repository";

export class courseRepository extends BaseRepository<ICourse> implements ICourseRepository {
constructor(){
  super(Course)
}

//get all courses with filter
  async getAllCourses(query: any, skip: number, limit: number): Promise<ICourse[]> {
    console.log(query,skip,limit);
    
    return await this.find(query).skip(skip).limit(limit)
}

//count documents
async countCourses(query: any): Promise<number> {
  return await this.countDocuments(query)
}

  // Create a new course
  async createCourse(courseData: Partial<ICourse>): Promise<ICourse> {
    try {
      const newCourse = new this.model(courseData);
      await newCourse.save();
      return newCourse;
    } catch (error: any) {
      throw new Error(`Error creating course: ${error.message}`);
    }
  }

  //get course by id
  async getCourseByID(courseId: string): Promise<ICourse|null> {
      try {
        console.log(courseId,"getcourserby id repository");
        
        const course=await this.findById(new mongoose.Types.ObjectId(courseId))

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

    return await this.findByIdAndUpdate(
      courseObjectId,
      { $addToSet: { enrolledStudents: userObjectId } },
      { new: true }
    );
  }


  //check student alredy in course
   async isUserEnrolled(courseId: string, userId: string): Promise<boolean> {
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const course = await this.findOne({
      _id: courseObjectId,
      enrolledStudents: userObjectId
    });

    return !!course;
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

  const courses=await this.find(query).skip((page-1)*limit).limit(limit)
  const total=await this.countDocuments(query)
  return {courses,total}
 }

async updateCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null> {
  return await this.findByIdAndUpdate(new mongoose.Types.ObjectId(id), data, { new: true });
}

}