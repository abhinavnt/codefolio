import { Request, RequestHandler, Response } from "express";

export interface ICourseController {
  addCourse:RequestHandler
  getCourseById:RequestHandler
  getUserEnrolledCourses:RequestHandler
  getUserCourseTasks:RequestHandler
  listCoursesAdmin:RequestHandler
  updateCourse:RequestHandler
  updateTask:RequestHandler
  deleteTask:RequestHandler
  getCourseByIdAdmin:RequestHandler
  getCourseWithTasks:RequestHandler
  updateCourseAdmin:RequestHandler
}