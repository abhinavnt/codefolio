import { Request, Response } from "express";
import { IMentorReqController } from "../../core/interfaces/controller/IMentorReqController";
import { AuthRequest } from "../../types/custom";
import cloudinary from "../../config/cloudinary";
import { mentorReqService } from "../../services/mentor/mentorReq.service";
import { IMentorRequest } from "../../models/MentorRequest";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IMentorReqService } from "../../core/interfaces/service/IMentorReqService";
import asyncHandler from "express-async-handler";
import { MentorRequestDTO } from "../../dtos/request/mentorRequest.dto";
// const MentorReqService = new mentorReqService();

@injectable()
export class MentorReqController implements IMentorReqController {
  constructor(@inject(TYPES.MentorReqService) private mentorReqService: IMentorReqService) {}

  addMentorReq = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    

    const userId = String(req.user?._id);
    

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      // Create DTO instance with request data and files
      const mentorDTO = new MentorRequestDTO(req.body, userId, req.files as { profileImage?: Express.Multer.File[]; resume?: Express.Multer.File[] });

      let profileImageUrl = "";
      let resumeUrl = "";

      // Upload profile image to Cloudinary if present
      if (mentorDTO.profileImage) {
        const profileImageBuffer = mentorDTO.profileImage.buffer; 
        
        await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "mentor_profiles" }, (error, result) => {
              if (error) {
                console.error("Cloudinary upload error (profile image):", error);
                reject(error);
                return;
              }
              if (result) {
                profileImageUrl = result.secure_url;
                resolve(result);
              }
            })
            .end(profileImageBuffer);
        });
      }

      // Upload resume to Cloudinary if present
      if (mentorDTO.resume) {
        const resumeBuffer = mentorDTO.resume.buffer;
        
        await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "mentor_resumes" }, (error, result) => {
              if (error) {
                console.error("Cloudinary upload error (resume):", error);
                reject(error);
                return;
              }
              if (result) {
                resumeUrl = result.secure_url;
                resolve(result);
              }
            })
            .end(resumeBuffer);
        });
      }

      // Convert DTO to mentor request data
      const mentorData = mentorDTO.toMentorData(profileImageUrl, resumeUrl);

      // Call the service to add the mentor request
      const mentorReq = await this.mentorReqService.addMentorRequest(userId, mentorData);

      res.status(201).json({
        message: "Mentor request submitted successfully",
        mentorRequest: mentorReq,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });
}
