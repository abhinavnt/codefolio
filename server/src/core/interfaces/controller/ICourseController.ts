import { Request, Response } from "express";

export interface ICourseController {
  addCourse(req: Request, res: Response): Promise<void>;
}