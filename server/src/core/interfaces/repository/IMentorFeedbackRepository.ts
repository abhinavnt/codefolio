import { IMentorFeedback } from "../../../models/MentorFeedback";

export interface IMentorFeedbackRepository {
  create(feedbackData: Partial<IMentorFeedback>): Promise<IMentorFeedback>;
  findByMentorId(mentorId: string, page: number, limit: number, excludeUserId?: string, rating?: number): Promise<IMentorFeedback[]>;
  findByMentorAndUser(mentorId: string, userId: string): Promise<IMentorFeedback | null>;
  findByUserId(userId: string): Promise<IMentorFeedback[]>;
  updateFeedback(id: string, updateData: Partial<IMentorFeedback>): Promise<IMentorFeedback | null>;
  countByMentorId(mentorId: string, excludeUserId?: string, rating?: number): Promise<number>;
}
