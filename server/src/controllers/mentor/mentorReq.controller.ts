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
// const MentorReqService = new mentorReqService();

@injectable()
export class MentorReqController implements IMentorReqController {
  constructor(
    @inject(TYPES.MentorReqService) private mentorReqService: IMentorReqService
  ) {}

  addMentorReq = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      console.log('yes here controller');
      
      const userId = String(req.user?._id);
       console.log('mentor request vanitund');
       
      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const {
        name,
        username,
        email,
        phoneNumber,
        dateOfBirth,
        yearsOfExperience,
        currentCompany,
        currentRole,
        durationAtCompany,
        technicalSkills,
        primaryLanguage,
        bio,
        linkedin,
        github,
        twitter,
        instagram,
      } = req.body;

      let profileImageUrl = "";
      let resumeUrl = "";

      if (
        req.files &&
        (req.files as { [fieldname: string]: Express.Multer.File[] })
          .profileImage
      ) {
        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };

        console.log("Uploading profile image to Cloudinary...");

        await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "mentor_profiles" }, (error, result) => {
              if (error) {
                console.error(
                  "Cloudinary upload error (profile image):",
                  error
                );
                reject(error);
                return;
              }
              if (result) {
                profileImageUrl = result.secure_url;
                resolve(result);
              }
            })
            .end(files.profileImage[0].buffer);
        });
      }

      if (
        req.files &&
        (req.files as { [fieldname: string]: Express.Multer.File[] }).resume
      ) {
        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };

        console.log("Uploading resume to Cloudinary...");

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
            .end(files.resume[0].buffer);
        });
      }

      // Prepare mentor request data
      const mentorData: Partial<IMentorRequest> = {
        profileImage: profileImageUrl,
        name,
        username,
        email,
        phoneNumber,
        dateOfBirth,
        yearsOfExperience,
        currentCompany,
        currentRole,
        durationAtCompany,
        resume: resumeUrl,
        technicalSkills,
        primaryLanguage,
        bio,
        linkedin,
        github,
        twitter,
        instagram,
      };

      const mentorReq = this.mentorReqService.addMentorRequest(
        userId,
        mentorData
      );

      res
        .status(201)
        .json({
          message: "Mentor request submitted successfully",
          mentorRequest: mentorReq,
        });
    }
  );
}

// export class MentorReqController implements IMentorReqController{

//     async addMentorReq(req: AuthRequest, res: Response): Promise<void> {
//         try {
//             console.log('mentor controlleril vannu');

//             const userId=req.user?.id

//             if (!userId) {
//                 res.status(401).json({ message: "Unauthorized" });
//                 return;
//               }
//               const { name, username, email, phoneNumber, dateOfBirth, yearsOfExperience, currentCompany, currentRole, durationAtCompany, technicalSkills, primaryLanguage, bio, linkedin, github, twitter, instagram } = req.body;
//               let profileImageUrl = "";
//               let resumeUrl = "";

//               const alredyApplied=await MentorReqService.findReq(userId)

//               if(alredyApplied){
//                 res.status(401).json({ message: "Alredy applied to become Mentor" });
//                 return;
//               }

//               const userName= await MentorReqService.findUserName(username)

//               if(userName) {
//                 res.status(401).json({ message: "user name alredy taken" });
//                 return;
//               }

//               if (req.files && (req.files as { [fieldname: string]: Express.Multer.File[] }).profileImage) {
//                 const files = req.files as { [fieldname: string]: Express.Multer.File[] }; // Explicitly define type

//                 console.log("Uploading profile image to Cloudinary...");

//                 await new Promise((resolve, reject) => {
//                   cloudinary.uploader.upload_stream({ folder: "mentor_profiles" }, (error, result) => {
//                     if (error) {
//                       console.error("Cloudinary upload error (profile image):", error);
//                       reject(error);
//                       return;
//                     }
//                     if (result) {
//                       profileImageUrl = result.secure_url;
//                       resolve(result);
//                     }
//                   }).end(files.profileImage[0].buffer);
//                 });
//               }

//               if (req.files && (req.files as { [fieldname: string]: Express.Multer.File[] }).resume) {
//                 const files = req.files as { [fieldname: string]: Express.Multer.File[] }; // Explicitly define type

//                 console.log("Uploading resume to Cloudinary...");

//                 await new Promise((resolve, reject) => {
//                   cloudinary.uploader.upload_stream({ folder: "mentor_resumes" }, (error, result) => {
//                     if (error) {
//                       console.error("Cloudinary upload error (resume):", error);
//                       reject(error);
//                       return;
//                     }
//                     if (result) {
//                       resumeUrl = result.secure_url;
//                       resolve(result);
//                     }
//                   }).end(files.resume[0].buffer);
//                 });
//               }

//               // Prepare mentor request data
//       const mentorData:Partial<IMentorRequest> = {
//         profileImage: profileImageUrl,
//         name,
//         username,
//         email,
//         phoneNumber,
//         dateOfBirth,
//         yearsOfExperience,
//         currentCompany,
//         currentRole,
//         durationAtCompany,
//         resume: resumeUrl,
//         technicalSkills,
//         primaryLanguage,
//         bio,
//         linkedin,
//         github,
//         twitter,
//         instagram,
//       };

//        const mentorreq= MentorReqService.addMentorRequest(userId,mentorData)

//        res.status(201).json({ message: "Mentor request submitted successfully", mentorRequest: mentorreq });

//         } catch (error:any) {
//             console.error("Error in addMentorRequest:", error);
//             res.status(400).json({ error: error.message });
//         }
//     }
// }
