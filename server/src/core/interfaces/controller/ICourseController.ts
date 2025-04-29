import { Request, RequestHandler, Response } from "express";

export interface ICourseController {
  addCourse:RequestHandler
  getCourseById:RequestHandler
  getUserEnrolledCourses:RequestHandler
  getUserCourseTasks:RequestHandler
  listCoursesAdmin:RequestHandler
  updateCourse:RequestHandler
  updateTask:RequestHandler
  getCourseByIdAdmin:RequestHandler
  getCourseWithTasks:RequestHandler
  updateCourseAdmin:RequestHandler
  markTaskAsComplete:RequestHandler
  getAllPurchasedCoursesAdmin:RequestHandler
  getUserTasksAdmin:RequestHandler
}