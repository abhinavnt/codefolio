import { inject, injectable } from "inversify";
import { IAdminService } from "../../core/interfaces/service/IAdminService";
import { IMentorRequest } from "../../models/MentorRequest";
import { IUser } from "../../models/User";
import { adminRepository } from "../../repositories/admin.repository";
import { mentorRepository } from "../../repositories/mentor.repository";
import { TYPES } from "../../di/types";
import { IAdminRepository } from "../../core/interfaces/repository/IAdminRepository";
import { IMentorRepository } from "../../core/interfaces/repository/IMentorRepository";
import { IUserRepository } from "../../core/interfaces/repository/IUserRepository";
import { applicationRejectionMail } from "../../utils/email.services";
import { IMentor } from "../../models/Mentor";


// const AdminRepository=new adminRepository() 
// const MentorRepository=new mentorRepository()

injectable()
export class adminService implements IAdminService{
  constructor(@inject(TYPES.AdminRepository) private adminRepository:IAdminRepository,
              @inject(TYPES.MentorRepository) private mentorRepository:IMentorRepository,
              @inject(TYPES.UserRepository) private userRepository:IUserRepository
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
  async updateMentorApplicationStatus(requestId: string, status: string,message:string): Promise<IMentorRequest> {
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

        const usermail= await this.userRepository.findUserById(userId)

        if(usermail){
          if(status.toLowerCase()==="rejected"){
            await applicationRejectionMail(usermail.email,message)
           }
        }

      
        //add a notifiation to the uer
        await this.userRepository.addNotification(userId,message)
        
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
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

 
  //toggle user status
  async toggleUserStatus(userId: string): Promise<IUser | null> {
      try {
        console.log("toggle service");
        console.log("User ID from service:", userId, typeof userId);
        const user=await this.adminRepository.toggleUserStatus(userId)
        return user
      } catch (error:any) {
        throw new Error(error instanceof Error ? error.message : String(error));
      }
  }

  //get all Mentors
  async getAllMentors(page: number, limit: number): Promise<{ allMentors: IMentor[]; total: number; }> {
      try {
        const {allMentors,total}=await this.adminRepository.getAllMentors(page,limit)
        return {allMentors,total}
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
      }
  }



    
}