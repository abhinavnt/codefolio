import { inject, injectable } from "inversify";
import { IMentorReqService } from "../../core/interfaces/service/IMentorReqService";
import { IMentorRequest } from "../../models/MentorRequest";
import { MentorReqRepository } from "../../repositories/mentorReq.repository";
import { UserRepository } from "../../repositories/user.repository";
import { TYPES } from "../../di/types";
import { IUserRepository } from "../../core/interfaces/repository/IUserRepository";
import { mentorRepository } from "../../repositories/mentor.repository";
import { IMentorReqRepository } from "../../core/interfaces/repository/IMentorReqRepository";

@injectable()
export class mentorReqService implements IMentorReqService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.MentorReqRepository) private mentorReqRepository: IMentorReqRepository
  ) {}

  async addMentorRequest(userId: string, mentorData: Partial<IMentorRequest>): Promise<void> {
    try {
      const existingReq = await this.mentorReqRepository.findReqById(userId);

      if (existingReq) throw new Error("Request alredy submited");

      if (!mentorData.username) {
        throw new Error("Username is required");
      }

      const isUsername = await this.mentorReqRepository.checkMentorUsername(mentorData.username);

      if (isUsername) throw new Error("username alredy taken");

      const mentorReq = await this.mentorReqRepository.addMentorRequest(userId, mentorData);

      await this.userRepository.updateReviewerRequestStatus(userId, "pending");
    } catch (error: any) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
}
