import { IMentorRequest } from "../../../models/MentorRequest";



export interface IMentorReqRepository{
    addMentorRequest(userId:string,mentorData:Partial<IMentorRequest>):Promise<IMentorRequest|null>
    findReqById(userId: string):Promise<IMentorRequest| null>
    checkMentorUsername(username:string):Promise<IMentorRequest |null>
}