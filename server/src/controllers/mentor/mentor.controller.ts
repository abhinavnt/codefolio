import { Request, RequestHandler, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { IMentorController } from "../../core/interfaces/controller/IMentorController";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IMentorService } from "../../core/interfaces/service/IMentorService";
import asyncHandler from "express-async-handler";
import cloudinary from "../../config/cloudinary";
import { IMentor } from "../../models/Mentor";
import { MentorDTO, MentorsResponseDTO } from "../../dtos/response/mentor.dto";

@injectable()
export class MentorController implements IMentorController {
  constructor(@inject(TYPES.MentorService) private mentorService: IMentorService) {}

  getAllMentors = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;
    const search = req.query.search as string;
    const rating = req.query.rating ? parseInt(req.query.rating as string) : undefined;
    const technicalSkills = req.query.technicalSkills ? (req.query.technicalSkills as string).split(",") : undefined;
    const priceRange = req.query.priceRange ? ((req.query.priceRange as string).split(",").map(Number) as [number, number]) : undefined;
    const filters = { rating, technicalSkills, priceRange };

    const { mentors, total } = await this.mentorService.getAllMentors(page, limit, search, filters);

    const response: MentorsResponseDTO = {
    data: MentorDTO.fromMentors(mentors),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };

    res.status(200).json(response);
  });

  getMentorProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;
    const mentor = await this.mentorService.getMentorProfile(username);

    if (!mentor) {
      res.status(404).json({ message: "Mentor not found" });
      return;
    }
    res.status(200).json(mentor);
  });

  verifyMentor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = String(req.user?._id);

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const mentor = await this.mentorService.verifyMentor(userId);

    res.status(200).json({ success: true, message: "Mentor verified successfully", data: mentor });
  });

  updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = String(req.user?._id);

    
    if (!userId) throw new Error("Unauthorized");

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
      status,
      title,
      location,
    } = req.body;

    let profileImageUrl = "";
    let resumeUrl = "";
    if (req.files && (req.files as { [fieldname: string]: Express.Multer.File[] }).profileImage) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      

      profileImageUrl = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "mentor_profiles" }, (error, result) => {
            if (error) {
              console.error("Cloudinary upload error (profile image):", error);
              reject(error);
            } else if (result) {
              resolve(result.secure_url);
            }
          })
          .end(files.profileImage[0].buffer);
      });
    }

    // Handle resume upload to Cloudinary
    if (req.files && (req.files as { [fieldname: string]: Express.Multer.File[] }).resume) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      

      resumeUrl = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "mentor_resumes" }, (error, result) => {
            if (error) {
              console.error("Cloudinary upload error (resume):", error);
              reject(error);
            } else if (result) {
              resolve(result.secure_url);
            }
          })
          .end(files.resume[0].buffer);
      });
    }

    // Prepare mentor data
    const mentorData: Partial<IMentor> = {
      profileImage: profileImageUrl || undefined,
      name,
      username,
      email,
      phoneNumber,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : undefined,
      currentCompany,
      currentRole,
      durationAtCompany,
      resume: resumeUrl || undefined,
      technicalSkills: technicalSkills ? JSON.parse(technicalSkills) : undefined,
      primaryLanguage,
      bio,
      linkedin,
      github,
      twitter,
      instagram,
      status: status as "active" | "inactive",
      title,
      location,
    };
    

    

    const updatedMentor = await this.mentorService.updateMentorProfile(userId, mentorData);
    res.status(200).json({ success: true, data: updatedMentor });
  });

  updateAvailability = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = String(req.user?._id);
    const { specificDateAvailability, weeklyAvailability } = req.body;
    

    const mentor = await this.mentorService.updateAvailability(userId, specificDateAvailability, weeklyAvailability);
    res.status(200).json({ message: "Availability updated successfully", mentor });
  });

  getAvailability = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    

    const mentorId = String(req.user?._id);
    const availability = await this.mentorService.getAvailability(mentorId);
    res.status(200).json(availability);
  });

  getTopMentors = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const mentors = await this.mentorService.getTopMentors();
    res.status(200).json(mentors);
  });
}
