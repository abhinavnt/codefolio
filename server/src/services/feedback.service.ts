import { inject, injectable } from "inversify";
import { IFeedbackService } from "../core/interfaces/service/IFeedbackService";
import { TYPES } from "../di/types";
import { IMentorFeedbackRepository } from "../core/interfaces/repository/IMentorFeedbackRepository";
import { IMentorFeedback } from "../models/MentorFeedback";

injectable();
export class FeedbackService implements IFeedbackService {
  constructor(@inject(TYPES.MentorFeedbackRepository) private mentorFeedbackRepository: IMentorFeedbackRepository) {}

  async submitFeedback(feedbackData: Partial<IMentorFeedback>): Promise<IMentorFeedback | null> {
    const { mentorId, userId, rating, feedback } = feedbackData;

    if (!mentorId || !userId) {
      throw new Error("Mentor ID and User ID are required");
    }

    if (!rating || rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    if (!feedback?.trim()) {
      throw new Error("Feedback text is required");
    }

    try {
      const existingFeedback = await this.mentorFeedbackRepository.findByMentorAndUser(mentorId.toString(), userId.toString());

      if (existingFeedback) {
        existingFeedback.rating = rating;
        existingFeedback.feedback = feedback;
        existingFeedback.updatedAt = new Date();
        return await this.mentorFeedbackRepository.updateFeedback(String(existingFeedback.id), existingFeedback);
      } else {
        return await this.mentorFeedbackRepository.create(feedbackData);
      }
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async getFeedbackByMentorId(
    mentorId: string,
    page: number,
    limit: number,
    excludeUserId?: string,
    rating?: number
  ): Promise<{ feedback: IMentorFeedback[]; total: number }> {
    try {
      const feedback = await this.mentorFeedbackRepository.findByMentorId(mentorId, page, limit, excludeUserId, rating);
      const total = await this.mentorFeedbackRepository.countByMentorId(mentorId);
      console.log("feedback from service", feedback);

      return { feedback, total };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async getFeedbackByUserId(userId: string): Promise<IMentorFeedback[]> {
    return this.mentorFeedbackRepository.findByUserId(userId);
  }
}
