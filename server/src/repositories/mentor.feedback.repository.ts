import mongoose, { Types } from "mongoose";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IMentorFeedbackRepository } from "../core/interfaces/repository/IMentorFeedbackRepository";
import { IMentorFeedback, MentorFeedback } from "../models/MentorFeedback";

export class MentorFeedbackRepository extends BaseRepository<IMentorFeedback> implements IMentorFeedbackRepository {
  constructor() {
    super(MentorFeedback);
  }

  async create(feedbackData: Partial<IMentorFeedback>): Promise<IMentorFeedback> {
    const feedback = new this.model(feedbackData);
    return await feedback.save();
  }

  async findByMentorId(mentorId: string, page: number, limit: number, excludeUserId?: string, rating?: number): Promise<IMentorFeedback[]> {
    const skip = (page - 1) * limit;

    let query: any = { mentorId };

    if (excludeUserId) {
      query.userId = { $ne: new mongoose.Types.ObjectId(excludeUserId) };
    }

    if (rating) {
      query.rating = rating;
    }
    return await this.find(query).populate("userId", "name profileImageUrl").skip(skip).limit(limit);
  }

  async countByMentorId(mentorId: string, excludeUserId?: string, rating?: number): Promise<number> {
    let query: any = { mentorId };
    if (excludeUserId) {
      query.userId = { $ne: new mongoose.Types.ObjectId(excludeUserId) };
    }
    if (rating) {
      query.rating = rating;
    }
    return await this.countDocuments(query);
  }

  async findByMentorAndUser(mentorId: string, userId: string): Promise<IMentorFeedback | null> {
    return await this.findOne({ mentorId, userId });
  }

  async findByUserId(userId: string): Promise<IMentorFeedback[]> {
    return await this.find({ userId }).populate("mentorId", "name profileImage");
  }

  async updateFeedback(id: string, updateData: Partial<IMentorFeedback>): Promise<IMentorFeedback | null> {
    return await this.findByIdAndUpdate(new mongoose.Types.ObjectId(id), updateData, { new: true });
  }



 
}
