// Adjust the path as needed

import mongoose from "mongoose";
import { ICourseRepository } from "../core/interfaces/repository/ICourseRepository";
import { Course, ICourse } from "../models/Course";
import { BaseRepository } from "../core/abstracts/base.repository";

export class courseRepository extends BaseRepository<ICourse> implements ICourseRepository {
  constructor() {
    super(Course);
  }

  //get all courses with filter
  async getAllCourses(query: any, skip: number, limit: number): Promise<ICourse[]> {
    console.log(query, skip, limit);

    return await this.find(query).skip(skip).limit(limit);
  }

  //count documents
  async countCourses(query: any): Promise<number> {
    return await this.countDocuments(query);
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
  async getCourseByID(courseId: string): Promise<ICourse | null> {
    try {
      console.log(courseId, "getcourserby id repository");

      const course = await this.findById(new mongoose.Types.ObjectId(courseId));

      // console.log('course from getcourse by id',course);

      return course;
    } catch (error: any) {
      throw new Error(`Error fetching course: ${error.message}`);
    }
  }

  //add student id into course enrollment
  async addStudentToCourse(courseId: string, userId: string): Promise<ICourse | null> {
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    return await this.findByIdAndUpdate(courseObjectId, { $addToSet: { enrolledStudents: userObjectId } }, { new: true });
  }

  //check student alredy in course
  async isUserEnrolled(courseId: string, userId: string): Promise<boolean> {
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const course = await this.findOne({
      _id: courseObjectId,
      enrolledStudents: userObjectId,
    });

    return !!course;
  }

  async getCoursesAdmin(
    search: string,
    category: string,
    status: string,
    page: number,
    limit: number
  ): Promise<{ courses: ICourse[]; total: number }> {
    const query: any = {};
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }];
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (status && status !== "all") {
      query.status = status;
    }

    const courses = await this.find(query)
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await this.countDocuments(query);
    return { courses, total };
  }

  async updateCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null> {
    return await this.findByIdAndUpdate(new mongoose.Types.ObjectId(id), data, { new: true });
  }

  //dashboard
  async getDashboardEnrolledCourses(): Promise<number> {
    const courses = await this.find({});
    return courses.reduce((total, course) => total + course.enrolledStudents.length, 0);
  }

  async getDashboardActiveCourses(): Promise<number> {
    return this.countDocuments({ status: "published" });
  }

  async getDashboardTotalStudents(): Promise<number> {
    const courses = await this.find({});
    const studentIds = new Set(courses.flatMap((course) => course.enrolledStudents.map((id) => id.toString())));
    return studentIds.size;
  }

  async getDashboardTotalEarning(): Promise<number> {
    const courses = await this.find({});
    return courses.reduce((total, course) => {
      const price = parseFloat(course.price) || 0;
      return total + price * course.enrolledStudents.length;
    }, 0);
  }

  async getDashboardEnrollmentsByCategory(): Promise<{ category: string; count: number }[]> {
    const courses = await this.find({});
    const categoryMap = new Map<string, number>();
    courses.forEach((course) => {
      const count = course.enrolledStudents.length;
      categoryMap.set(course.category, (categoryMap.get(course.category) || 0) + count);
    });
    return Array.from(categoryMap, ([category, count]) => ({ category, count }));
  }

  async getDashboardMonthlyRevenue(): Promise<{ month: string; revenue: number }[]> {
    const courses = await this.find({}).populate({
      path: "enrolledStudents",
      populate: { path: "notifications" },
    });
    const monthlyRevenue = new Map<string, number>();
    courses.forEach((course) => {
      const price = parseFloat(course.price) || 0;
      course.enrolledStudents.forEach((student: any) => {
        student.notifications.forEach((notification: any) => {
          const date = new Date(notification.createdAt);
          const month = date.toLocaleString("default", { month: "short", year: "numeric" });
          monthlyRevenue.set(month, (monthlyRevenue.get(month) || 0) + price);
        });
      });
    });
    return Array.from(monthlyRevenue, ([month, revenue]) => ({ month, revenue })).sort(
      (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
    );
  }

  async getDashboardCoursesSold(): Promise<number> {
    const courses = await Course.find();
    return courses.reduce((total, course) => total + course.enrolledStudents.length, 0);
  }
}
