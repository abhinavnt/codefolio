import { inject, injectable } from "inversify";
import cloudinary from "../../config/cloudinary";
import { ICourseController } from "../../core/interfaces/controller/ICourseController";
import { Request, Response } from "express";
import { TYPES } from "../../di/types";
import { ICourseService } from "../../core/interfaces/service/ICourseService";
import asyncHandler from "express-async-handler";
import { ITask } from "../../models/Tasks";
import { ICourse } from "../../models/Course";

@injectable()
export class CourseController implements ICourseController {
  constructor(@inject(TYPES.CourseServices) private courseService: ICourseService) {}

  addCourse = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    

    const { title, description, category, level, price, duration, modules, learningPoints, targetedAudience, courseRequirements, status } = req.body;

    

    let image = "";

    

    if (req.files && (req.files as { [fieldname: string]: Express.Multer.File[] }).image) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      

      await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "mentor_profiles" }, (error, result) => {
            if (error) {
              console.error("Cloudinary upload error (profile image):", error);
              reject(error);
              return;
            }
            if (result) {
              image = result.secure_url;
              resolve(result);
            }
          })
          .end(files.image[0].buffer);
      });
    }

    const parsedModules = modules ? JSON.parse(modules) : [];

    const courseData = {
      title,
      description,
      category,
      level,
      price,
      duration,
      image,
      modules: parsedModules,
      learningPoints,
      targetedAudience,
      courseRequirements,
      status,
    };

    const newCourse = await this.courseService.addCourse(courseData);

    res.status(201).json({
      message: "Course and tasks created successfully",
      course: newCourse,
    });
  });

  getCourseById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    

    const courseId = req.params.id;
    

    if (!courseId) {
      res.status(400).json({ message: "course id is required" });
    }

    const course = await this.courseService.getCourseById(courseId);
    

    res.status(200).json({ course, message: "got the course" });
  });

  listCoursesAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { search = "", category = "all", status = "all", page = "1", limit = "5" } = req.query;
    const result = await this.courseService.getCoursesAdmin(
      search as string,
      category as string,
      status as string,
      parseInt(page as string),
      parseInt(limit as string)
    );
    // 

    res.status(200).json(result);
  });

  updateCourse = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = req.body;
    const updatedCourse = await this.courseService.updateCourse(id, data);
    if (!updatedCourse) {
      res.status(404).json({ message: "Course not found" });
    }
    res.json(updatedCourse);
  });

  updateTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const data = req.body;
    const updatedTask = await this.courseService.updateTask(id, data);
    if (!updatedTask) {
      res.status(404).json({ message: "Task not found" });
    }
    res.json(updatedTask);
  });

  getCourseByIdAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const course = await this.courseService.getCourseById(id);
    const task = await this.courseService.getCourseTasks(id);
  });

  //get user enroled courses
  getUserEnrolledCourses = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    

    const userId = String(req.user?._id);
    const courses = await this.courseService.findCoursePurchaseByUserId(userId);
    

    res.status(200).json(courses);
  });

  //get user enrolled courses tasks
  getUserCourseTasks = asyncHandler(async (req: Request, res: Response) => {
    const userId = String(req.user?._id);
    const courseId = req.params.courseId;
    

    const tasks = await this.courseService.findTaskByUserIdAndCourseId(userId, courseId);

    res.status(200).json(tasks);
  });

  getCourseWithTasks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    

    const { id } = req.params;

    const course = await this.courseService.getCourseById(id);
    

    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    const tasks = await this.courseService.getCourseTasks(id);
    

    res.status(200).json({ course, tasks });
  });

  updateCourseAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { course, tasks } = req.body;

    let parsedCourse: Partial<ICourse>;
    try {
      parsedCourse = typeof course === "string" ? JSON.parse(course) : course;
    } catch (error) {
      res.status(400).json({ message: "Invalid course data format" });
      return;
    }

    let parsedTasks: Partial<ITask>[] = [];
    try {
      parsedTasks = typeof tasks === "string" ? JSON.parse(tasks) : tasks;
    } catch (error) {
      res.status(400).json({ message: "Invalid tasks data format" });
      return;
    }
    let image = parsedCourse.image;

    if (req.files && (req.files as { [fieldname: string]: Express.Multer.File[] }).image) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "mentor_profiles" }, (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            if (result) {
              resolve(result.secure_url);
            }
          })
          .end(files.image[0].buffer);
      });

      image = uploadResult as string;
    }

    const updatedCourseData = { ...parsedCourse, image };

    const updatedCourse = await this.courseService.updateCourseAndTasks(id, updatedCourseData, parsedTasks);

    if (!updatedCourse) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    res.json(updatedCourse);
  });

  markTaskAsComplete = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const taskId = req.params.taskId;
    const userId = String(req.user?._id);
    const updatedTask = await this.courseService.markTaskAsComplete(taskId, userId);
    res.status(200).json(updatedTask);
  });

  getAllPurchasedCoursesAdmin = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const search = req.query.search as string;
    const courseFilter = req.query.courseFilter as string;
    const statusFilter = req.query.statusFilter as string;

    const { courses, total } = await this.courseService.getAllPurchasedCoursesAdmin(page, limit, search, courseFilter, statusFilter);

    res.json({ courses, total });
  });

  getUserTasksAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { userId, courseId } = req.params;
    const tasks = await this.courseService.findTaskByUserIdAndCourseId(userId, courseId);
    res.status(200).json(tasks);
  });

  findPurchasedCourseById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    

    const { courseId, userId } = req.params;
    const course = await this.courseService.findCourseById(courseId, userId);

    res.status(200).json(course);
  });

  getTopCourses = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const courses = await this.courseService.getTopCourses();
    res.status(200).json(courses);
  });
}
