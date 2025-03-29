import { Request, RequestHandler, Response } from "express";

export interface ICourseController {
  addCourse:RequestHandler
}