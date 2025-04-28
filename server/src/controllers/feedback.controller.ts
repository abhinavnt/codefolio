import { inject, injectable } from "inversify";
import { IFeedbackController } from "../core/interfaces/controller/IFeedbackController";
import { TYPES } from "../di/types";
import { IFeedbackService } from "../core/interfaces/service/IFeedbackService";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

injectable();
export class FeedbackController implements IFeedbackController {
  constructor(@inject(TYPES.FeedbackService) private feedbackService: IFeedbackService) {}

  submitMentorFeedback = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const feedbackData = req.body;
    const feedback = await this.feedbackService.submitFeedback(feedbackData);
    res.status(201).json(feedback);
  });

  getFeedbackByMentorId = asyncHandler(async (req: Request, res: Response) => {
    const mentorId = req.params.mentorId;

    const page = parseInt(req.query.page as string) || 1;

    const limit = parseInt(req.query.limit as string) || 5;

    const excludeUserId = req.query.excludeUserId as string;

    const rating = req.query.rating ? parseInt(req.query.rating as string) : undefined;

    const feedback = await this.feedbackService.getFeedbackByMentorId(mentorId, page, limit, excludeUserId, rating);
    console.log(feedback, "feedback from the backend controler ");

    res.status(200).json(feedback);
  });

  getUserFeedbacks = asyncHandler(async (req: Request, res: Response) => {
    const userId = String(req.user?._id);

    const feedbacks = await this.feedbackService.getFeedbackByUserId(userId);
    res.status(200).json(feedbacks);
  });

  submitCourseFeedback = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { courseId, rating, feedback } = req.body;

    const userId = String(req.user?._id);

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const submittedFeedback = await this.feedbackService.submitCourseFeedback(userId, courseId, rating, feedback);

    res.status(201).json(submittedFeedback);
  });

  getCourseFeedback = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { courseId } = req.params;
    const userId = String(req.user?._id);
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const feedback = await this.feedbackService.getFeedbackByCourseAndUser(courseId, userId);
    res.status(200).json(feedback);
  });

  getFeedbackByCourseId = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      res.status(401).json({ message: "id not found" });
      return;
    }
    const feedback = await this.feedbackService.getFeedbackByCourseId(id);
    res.status(200).json(feedback);
  });
}
