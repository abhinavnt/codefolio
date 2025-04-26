import { inject, injectable } from "inversify";
import { IFeedbackController } from "../core/interfaces/controller/IFeedbackController";
import { TYPES } from "../di/types";
import { IFeedbackService } from "../core/interfaces/service/IFeedbackService";
import asyncHandler from "express-async-handler";
import { NextFunction, Request, RequestHandler, Response } from "express";

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
    const feedback = await this.feedbackService.getFeedbackByMentorId(mentorId);
    res.status(200).json(feedback);
  });

  getUserFeedbacks = asyncHandler(async (req: Request, res: Response) => {
    console.log('iam from get user feedbacks controller');
    
    const userId = String(req.user?._id);
    console.log('userid from controler getuser feeback',userId);
    
    const feedbacks = await this.feedbackService.getFeedbackByUserId(userId);
    res.status(200).json(feedbacks);
  });
}
