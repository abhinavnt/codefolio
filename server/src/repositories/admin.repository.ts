import { IAdminRepository } from "../core/interfaces/repository/IAdminRepository";
import { IMentor, IMentorData, Mentor } from "../models/Mentor";
import { IMentorRequest, MentorRequest } from "../models/MentorRequest";
import { IUser, User } from "../models/User";






export class adminRepository implements IAdminRepository{
    
    //get all mentors
    async getMentorApplicationRequest(page: number, limit: number): Promise<{ mentorRequests: IMentorRequest[]; total: number; }> {
        const skip=(page-1)*limit
        const requests=await MentorRequest.find().sort({createdAt:-1}).skip(skip).limit(limit).lean()

        const total= await MentorRequest.countDocuments()
        
        return {mentorRequests:requests,total}
    }
    
    //update application request
    async updateMentorApplicationStatus(requestId: string, status: string): Promise<{ mentorRequest: IMentorRequest | null; userId: string | null; }> {

        const updatedRequest= await MentorRequest.findByIdAndUpdate(requestId,{status},{new:true})
        if (!updatedRequest) {
            return { mentorRequest: null, userId: null };
          }

          return { mentorRequest: updatedRequest, userId: updatedRequest.userId };
    }

    //update user mentor req state
    async updateUserMentorApplicationStatus(userId: string, status: string): Promise<IUser | null> {
        const user= await User.findById(userId) as IUser|null
        if(!user){
            return null
        }


        const existingStatusIndex = user.reviewerRequestStatus.findIndex((s) => s === "pending" || s === "approved" || s === "rejected");
        if (existingStatusIndex !== -1) {
          user.reviewerRequestStatus[existingStatusIndex] = status.toLowerCase() as "pending" | "approved" | "rejected";
        } else {
          user.reviewerRequestStatus.push(status.toLowerCase() as "pending" | "approved" | "rejected");
        }

        await user.save();

        return user

    }


    //create new mentor
    async createMentorFromRequest(mentorRequest: IMentorRequest): Promise<IMentor | null> {

        const mentorData: IMentorData = {
            userId: mentorRequest.userId,
            profileImage: mentorRequest.profileImage,
            name: mentorRequest.name,
            username: mentorRequest.username,
            email: mentorRequest.email,
            phoneNumber: mentorRequest.phoneNumber,
            dateOfBirth: mentorRequest.dateOfBirth,
            yearsOfExperience: mentorRequest.yearsOfExperience,
            currentCompany: mentorRequest.currentCompany,
            currentRole: mentorRequest.currentRole,
            durationAtCompany: mentorRequest.durationAtCompany,
            resume: mentorRequest.resume,
            technicalSkills: mentorRequest.technicalSkills,
            primaryLanguage: mentorRequest.primaryLanguage,
            bio: mentorRequest.bio,
            linkedin: mentorRequest.linkedin,
            github: mentorRequest.github,
            twitter: mentorRequest.twitter,
            instagram: mentorRequest.instagram,
            status: "active",
          };
          const newMentor = new Mentor(mentorData);
           await newMentor.save();
           return newMentor;
    }

    async updateMentorStatus(userId: string, status: "active" | "inactive"): Promise<IMentor | null> {
        return await Mentor.findOneAndUpdate({userId},{status},{new:true})
    }

    async getallUsers(page: number, limit: number): Promise<{ allUsers: IUser[]; total: number; }> {
        const skip=(page-1)*limit
        const requests=await User.find().sort({createdAt:-1}).skip(skip).limit(limit).lean()

        const total= await MentorRequest.countDocuments()
        
        return {allUsers:requests,total}
    }


}