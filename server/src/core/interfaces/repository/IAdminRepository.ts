import { IMentor } from "../../../models/Mentor";
import { IMentorRequest } from "../../../models/MentorRequest";
import { IUser } from "../../../models/User";




export interface IAdminRepository {
    getMentorApplicationRequest(page: number, limit: number): Promise<{ mentorRequests: IMentorRequest[], total: number }>;
    updateMentorApplicationStatus(requestId:string,status:string):Promise<{mentorRequest:IMentorRequest|null,userId:string|null}>
    updateUserMentorApplicationStatus(userId:string,status:string):Promise<IUser|null>
    createMentorFromRequest(mentorRequest: IMentorRequest): Promise<IMentor | null>
    updateMentorStatus(userId:string,status:"active"|"inactive"):Promise<IMentor|null>
}
