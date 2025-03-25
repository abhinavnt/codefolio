import { IMentorRequest } from "../../../models/MentorRequest";




export interface IAdminService{
    getMentorApplicationRequest(page:number,limit:number):Promise<{mentorRequests:IMentorRequest[], total: number}>
    updateMentorApplicationStatus(requestId: string, status: string):Promise<IMentorRequest>
}