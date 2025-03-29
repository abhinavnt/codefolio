import { inject, injectable } from "inversify";
import { IAdminService } from "../../core/interfaces/service/IAdminService";
import { IMentorRequest } from "../../models/MentorRequest";
import { IUser } from "../../models/User";
import { adminRepository } from "../../repositories/admin.repository";
import { mentorRepository } from "../../repositories/mentor.repository";
import { TYPES } from "../../di/types";
import { IAdminRepository } from "../../core/interfaces/repository/IAdminRepository";
import { IMentorRepository } from "../../core/interfaces/repository/IMentorRepository";


// const AdminRepository=new adminRepository() 
// const MentorRepository=new mentorRepository()

injectable()
export class adminService implements IAdminService{
  constructor(@inject(TYPES.AdminRepository) private adminRepository:IAdminRepository,
              @inject(TYPES.MentorRepository) private mentorRepository:IMentorRepository
){}

  //get all mentor application
  async getMentorApplicationRequest(page: number=1, limit: number=10): Promise<{ mentorRequests: IMentorRequest[]; total: number; }> {
      try {
        const {mentorRequests,total}=await this.adminRepository.getMentorApplicationRequest(page,limit)
        return {mentorRequests,total}
      } catch (error) {
        throw new Error("Error when fetching mentor applications");
      }
  }

  //update status
  async updateMentorApplicationStatus(requestId: string, status: string): Promise<IMentorRequest> {
      try {
        const { mentorRequest, userId }= await this.adminRepository.updateMentorApplicationStatus(requestId,status)

        if (!mentorRequest) {
          throw new Error("Mentor application not found");
        }

        //update user request status
        if(userId){
          const updatedUser= await this.adminRepository.updateUserMentorApplicationStatus(userId,status)
          if(!updatedUser){
            throw new Error ("error while user schema change")
          }
        }else{
          throw new Error ("userId not found in the mentorRequest")
        }


        const mentor= await this.mentorRepository.findByUserId(mentorRequest.userId)
       
        //create mentor or update status 
        if(!mentor){
          if(status.toLowerCase() === "approved"){
            try {
              const newMentor= await this.adminRepository.createMentorFromRequest(mentorRequest)
            } catch (error) {
              throw new Error("error when creating new user")
            }
          }
        }else{
          if(status.toLowerCase() === "rejected" || status.toLowerCase() === "pending"){
             await this.adminRepository.updateMentorStatus(userId,'inactive')
          }else if(status.toLowerCase() === "approved"){
             await this.adminRepository.updateMentorStatus(userId,'active')
          }
        }
        
        return mentorRequest

      } catch (error) {
        throw new Error("Error updating mentor application status");
      }
  }


  //get all users
  async getAllUsers(page: number, limit: number): Promise<{ allUsers: IUser[]; total: number; }> {
    try {
      const {allUsers,total}=await this.adminRepository.getallUsers(page,limit)

      return {allUsers,total}
    } catch (error) {
      throw new Error("Error when fetching mentor applications");
    }
  }


    
}