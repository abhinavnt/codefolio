import { IMentor } from "../../../models/Mentor";
import { IMentorRequest } from "../../../models/MentorRequest";
import { IUser } from "../../../models/User";

export interface IAdminService {
  getMentorApplicationRequest(
    page: number,
    limit: number,
    search: string,
    status: string
  ): Promise<{ mentorRequests: IMentorRequest[]; total: number }>;
  updateMentorApplicationStatus(requestId: string, status: string, message: string): Promise<IMentorRequest>;
  getAllUsers(page: number, limit: number): Promise<{ allUsers: IUser[]; total: number }>;
  toggleUserStatus(userId: string): Promise<IUser | null>;
  getAllMentors(page: number, limit: number): Promise<{ allMentors: IMentor[]; total: number }>;
  toggleMentorStatus(userId: string, status: string): Promise<IMentor | null>;
}
