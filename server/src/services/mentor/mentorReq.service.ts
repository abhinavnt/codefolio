import { IMentorReqService } from "../../core/interfaces/service/IMentorReqService";
import { IMentorRequest } from "../../models/MentorRequest";
import { MentorReqRepository } from "../../repositories/mentorReq.repository";
import { UserRepository } from "../../repositories/user.repository";






const mentorReqRepository=new MentorReqRepository()

const userRepository=new UserRepository()



export class mentorReqService implements IMentorReqService{

//   async findUserName(username: string): Promise<IMentorReqService | null> {
//     const mentor = await mentorReqRepository.checkMentorUsername(username);
    
//     if (!mentor) return null;

//     // Transform IMentorRequest to IMentorReqService
//     const mappedMentor: any = {
//         // Ensure that all required properties in IMentorReqService are mapped from mentor
//         ...mentor, // If structures are similar, spread properties
//     };

//     return mappedMentor;
// }


// async findReq(userId: string): Promise<IMentorReqService | null> {
//   const mentor = await mentorReqRepository.findReqById(userId)
    
//   if (!mentor) return null;

//   const mappedMentor: any = {
      
//       ...mentor, 
//   };

//   return mappedMentor;
// }

  async addMentorRequest(userId: string, mentorData: Partial<IMentorRequest>): Promise<void> {
       try {
        const existingReq= await mentorReqRepository.findReqById(userId)

        if(existingReq) throw new Error("Request alredy submited")

            if (!mentorData.username) {
                throw new Error("Username is required");
            }
        
        const isUsername=await mentorReqRepository.checkMentorUsername(mentorData.username)

          if(isUsername) throw new Error("username alredy taken")

            const mentorReq=await mentorReqRepository.addMentorRequest(userId,mentorData)

             await userRepository.updateReviewerRequestStatus(userId,'pending')

       } catch (error:any) {
        throw new Error(error.message);
       }
   }


}


