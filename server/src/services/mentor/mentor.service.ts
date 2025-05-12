import { inject, injectable } from "inversify";
import { IMentorService } from "../../core/interfaces/service/IMentorService";
import { IMentor, ISpecificDateAvailability, IWeeklyAvailability } from "../../models/Mentor";
import { TYPES } from "../../di/types";
import { IMentorRepository } from "../../core/interfaces/repository/IMentorRepository";

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
}

@injectable()
export class MentorService implements IMentorService {
  constructor(@inject(TYPES.MentorRepository) private mentorRepository: IMentorRepository) {}

  async getAllMentors(
    page: number,
    limit: number,
    search?: string,
    filters?: { rating?: number; technicalSkills?: string[]; priceRange?: [number, number] }
  ): Promise<{ mentors: IMentor[]; total: number }> {
    return await this.mentorRepository.getAllMentors(page, limit, search, filters);
  }

  async getMentorProfile(username: string): Promise<Partial<IMentor> | null> {
    try {
      const mentor = await this.mentorRepository.findByUsername(username);
      return mentor;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async verifyMentor(userId: string): Promise<IMentor | null> {
    try {
      const mentor = await this.mentorRepository.findByUserId(userId);

      if (!mentor) {
        throw new Error("Mentor not found");
      }

      if (mentor.status !== "active") {
        throw new Error("Mentor blocked by admin");
      }

      return mentor;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async updateMentorProfile(userId: string, mentorData: Partial<IMentor>): Promise<IMentor | null> {
    try {
      console.log("service mento update came");
      const existingMentor = await this.mentorRepository.findByUserId(userId);
      if (!existingMentor) throw new Error("Mentor not found");
      const updatedData = { ...existingMentor, ...mentorData };

      const {
        profileImage,
        name,
        username,
        email,
        phoneNumber,
        dateOfBirth,
        yearsOfExperience,
        currentCompany,
        currentRole,
        durationAtCompany,
        resume,
        technicalSkills,
        primaryLanguage,
        bio,
        linkedin,
        github,
        twitter,
        instagram,
        status,
        title,
        reviewTakenCount,
        phone,
        location,
      } = updatedData;

      // Build the update object dynamically, only including fields that are provided (not undefined/null)
      const updateData: Partial<IMentor> = {};
      if (profileImage !== undefined) updateData.profileImage = profileImage;
      if (name !== undefined) updateData.name = name;
      if (username !== undefined) updateData.username = username;
      if (email !== undefined) updateData.email = email;
      if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
      if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
      if (yearsOfExperience !== undefined) updateData.yearsOfExperience = yearsOfExperience;
      if (currentCompany !== undefined) updateData.currentCompany = currentCompany;
      if (currentRole !== undefined) updateData.currentRole = currentRole;
      if (durationAtCompany !== undefined) updateData.durationAtCompany = durationAtCompany;
      if (resume !== undefined) updateData.resume = resume;
      if (technicalSkills !== undefined) updateData.technicalSkills = technicalSkills;
      if (primaryLanguage !== undefined) updateData.primaryLanguage = primaryLanguage;
      if (bio !== undefined) updateData.bio = bio;
      if (linkedin !== undefined) updateData.linkedin = linkedin;
      if (github !== undefined) updateData.github = github;
      if (twitter !== undefined) updateData.twitter = twitter;
      if (instagram !== undefined) updateData.instagram = instagram;
      if (status !== undefined) updateData.status = status;
      if (title !== undefined) updateData.title = title;
      if (reviewTakenCount !== undefined) updateData.reviewTakenCount = reviewTakenCount;
      if (phone !== undefined) updateData.phone = phone;
      if (location !== undefined) updateData.location = location;

      return this.mentorRepository.updateMentor(userId, updateData);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async updateAvailability(
    mentorId: string,
    specificDateAvailability: ISpecificDateAvailability[],
    weeklyAvailability: IWeeklyAvailability[]
  ): Promise<IMentor | null> {
    try {
      const ogMentorId = await this.mentorRepository.findByUserId(mentorId);
      if (!ogMentorId) {
        throw new Error("mentor not found");
      }

      const mentor = await this.mentorRepository.updateAvailability(ogMentorId.id, specificDateAvailability, weeklyAvailability);
      if (!mentor) {
        throw new Error("Mentor not found");
      }
      return mentor;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async getAvailability(
    mentorId: string
  ): Promise<{ specificDateAvailability: ISpecificDateAvailability[]; weeklyAvailability: IWeeklyAvailability[] }> {
    try {
      const ogMentorId = await this.mentorRepository.findByUserId(mentorId);
      console.log(ogMentorId, "orginal mentor id fromservice");

      if (!ogMentorId) {
        throw new Error("mentor not found");
      }
      const mentor = await this.mentorRepository.getAvailability(ogMentorId._id as string);

      if (!mentor) {
        throw new Error("Mentor not found");
      }

      return {
        specificDateAvailability: mentor.specificDateAvailability,
        weeklyAvailability: mentor.weeklyAvailability,
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async getTopMentors(): Promise<IMentor[]> {
      return this.mentorRepository.getTopMentors(4);
  }
}
