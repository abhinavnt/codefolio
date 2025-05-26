import { IMentorReqRepository } from "../core/interfaces/repository/IMentorReqRepository";
import { IMentorRequest, MentorRequest } from "../models/MentorRequest";

export class MentorReqRepository implements IMentorReqRepository {
  async findReqById(userId: string): Promise<IMentorRequest | null> {
    return await MentorRequest.findOne({ userId });
  }

  async addMentorRequest(userId: string, mentorData: Partial<IMentorRequest>): Promise<IMentorRequest | null> {
    return MentorRequest.create({ ...mentorData, userId });
  }

  async checkMentorUsername(username: string): Promise<IMentorRequest | null> {
    return MentorRequest.findOne({ username });
  }

  async getMentorApplicationRequest(
    page: number,
    limit: number,
    search: string,
    status: string
  ): Promise<{ mentorRequests: IMentorRequest[]; total: number }> {
    const skip = (page - 1) * limit;

    let query: any = {};

    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
    }

    if (status !== "all") {
      query.status = { $regex: `^${status}$`, $options: "i" };
    }

    const requests = await MentorRequest.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

    const total = await MentorRequest.countDocuments(query);

    return { mentorRequests: requests, total };
  }

  async updateMentorApplicationStatus(requestId: string, status: string): Promise<{ mentorRequest: IMentorRequest | null; userId: string | null }> {
    const updatedRequest = await MentorRequest.findByIdAndUpdate(requestId, { status }, { new: true });
    if (!updatedRequest) {
      return { mentorRequest: null, userId: null };
    }

    return { mentorRequest: updatedRequest, userId: updatedRequest.userId };
  }
}
