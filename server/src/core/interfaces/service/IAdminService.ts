import { IMentorRequest } from "../../../models/MentorRequest";
import { IUser } from "../../../models/User";




export interface IAdminService{
    getMentorApplicationRequest(page:number,limit:number):Promise<{mentorRequests:IMentorRequest[], total: number}>
    updateMentorApplicationStatus(requestId: string, status: string):Promise<IMentorRequest>
    getAllUsers(page:number,limit:number):Promise<{allUsers:IUser[],total:number}>
}