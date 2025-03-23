import { IMentorReqRepository } from "../core/interfaces/repository/IMentorReqRepository";
import { IMentorRequest, MentorRequest } from "../models/MentorRequest";


export class MentorReqRepository implements IMentorReqRepository{

    async findReqById(userId: string): Promise<IMentorRequest | null> {
        return await MentorRequest.findOne({userId})
    }

    async addMentorRequest(userId: string, mentorData: Partial<IMentorRequest>): Promise<IMentorRequest | null> {
      
        return MentorRequest.create({...mentorData,userId})
    }

    async checkMentorUsername(username:string):Promise<IMentorRequest |null>{
        return MentorRequest.findOne({username})
    }
}