import { IMentorRequest } from "../../../models/MentorRequest";




export interface IMentorReqService{
     addMentorRequest(userId:string,mentorData:Partial<IMentorRequest>):Promise<void>
     
     // findUserName(username:string):Promise<IMentorReqService | null>

     // findReq(userId:string):Promise<IMentorReqService | null>
}