import { RequestHandler } from "express";

export interface IFeedbackController {
  submitMentorFeedback: RequestHandler;
  getFeedbackByMentorId: RequestHandler;
  getUserFeedbacks: RequestHandler;
  submitCourseFeedback:RequestHandler;
  getCourseFeedback:RequestHandler;
  getFeedbackByCourseId:RequestHandler
}
