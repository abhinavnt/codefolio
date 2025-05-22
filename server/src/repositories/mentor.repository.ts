import { endOfDay, getDay, startOfDay } from "date-fns";
import { IMentorRepository } from "../core/interfaces/repository/IMentorRepository";
import { IMentor, IMentorData, ISpecificDateAvailability, IWeeklyAvailability, Mentor } from "../models/Mentor";
import { IMentorRequest } from "../models/MentorRequest";
import { BaseRepository } from "../core/abstracts/base.repository";
import mongoose, { Types } from "mongoose";

export class mentorRepository extends BaseRepository<IMentor> implements IMentorRepository {
  constructor() {
    super(Mentor);
  }
  async findByUserId(userId: string): Promise<IMentor | null> {
    return await this.findOne({ userId });
  }

  async findByMentorID(mentorId: string): Promise<IMentor | null> {
    return await this.findById(new mongoose.Types.ObjectId(mentorId));
  }

  async getAllMentors(
    page: number,
    limit: number,
    search?: string,
    filters?: { rating?: number; technicalSkills?: string[]; priceRange?: [number, number] }
  ): Promise<{ mentors: IMentor[]; total: number }> {
    const query: any = { status: "active" };

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (filters) {
      if (filters.rating) {
        query.reviewTakenCount = { $gte: filters.rating };
      }
      if (filters.technicalSkills && filters.technicalSkills.length > 0) {
        query.technicalSkills = { $in: filters.technicalSkills };
      }
      if (filters.priceRange) {
        // Assuming we add a price field to mentor schema later
        query.price = { $gte: filters.priceRange[0], $lte: filters.priceRange[1] };
      }
    }

    const [mentors, total] = await Promise.all([
      Mentor.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Mentor.countDocuments(query),
    ]);

    return { mentors, total };
  }

  async findByUsername(username: string): Promise<IMentor | null> {
    return await this.findOne({ username });
  }

  async updateMentor(userId: string, mentorData: Partial<IMentor>): Promise<IMentor | null> {
   

    const mentor = await this.findOne({ userId: userId });

    if (!mentor) {
      throw new Error("mentornot found");
    }

    const mentorId = mentor._id as Types.ObjectId;

    const updatedMentor = await this.findByIdAndUpdate(mentorId, { $set: mentorData }, { new: true, runValidators: true });
    

    if (!updatedMentor) throw new Error("Failed to update mentor");
    return updatedMentor;
  }

  async updateAvailability(
    mentorId: string,
    specificDateAvailability: ISpecificDateAvailability[],
    weeklyAvailability: IWeeklyAvailability[]
  ): Promise<IMentor | null> {
    const response = await this.findByIdAndUpdate(
      new mongoose.Types.ObjectId(mentorId),
      { specificDateAvailability, weeklyAvailability },
      { new: true }
    );
    

    return response;
  }

  async getAvailability(mentorId: string): Promise<IMentor | null> {
    return await Mentor.findById(mentorId).select("specificDateAvailability weeklyAvailability");
  }

  async getAvailableSlots(
    mentorId: string,
    from: Date,
    to: Date
  ): Promise<{ date: string; day: string; timeSlots: { startTime: string; endTime: string }[] }[]> {
    const mentor = await this.findById(new mongoose.Types.ObjectId(mentorId));

    if (!mentor) {
      throw new Error("Mentor not found");
    }

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = [];
    let currentDate = startOfDay(from);

    while (currentDate <= endOfDay(to)) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const day = days[getDay(currentDate)];

      // Check specific date availability
      const specific = mentor.specificDateAvailability.find((s) => s.date.toISOString().split("T")[0] === dateStr);

      let timeSlots = specific
        ? specific.timeSlots.filter((slot) => !slot.booked)
        : mentor.weeklyAvailability.find((w) => w.day === day)?.timeSlots.filter((slot) => !slot.booked) || [];

      result.push({
        date: dateStr,
        day,
        timeSlots: timeSlots.map((slot) => ({
          startTime: slot.startTime,
          endTime: slot.endTime,
          isBooked: slot.booked,
        })),
      });

      currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    }

    return result;
  }

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
    const newMentor = new this.model(mentorData);
    await newMentor.save();
    return newMentor;
  }

  async updateMentorStatus(userId: string, status: "active" | "inactive"): Promise<IMentor | null> {
    return await this.findOneAndUpdate({ $or: [{ userId }, { _id: userId }] }, { status }, { new: true });
  }

  async getAllMentorsAdmin(page: number, limit: number): Promise<{ allMentors: IMentor[]; total: number }> {
    const skip = (page - 1) * limit;
    const request = await this.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await this.countDocuments({});
    return { allMentors: request, total };
  }

  async getTopMentors(limit: number): Promise<IMentor[]> {
      return this.find({ status: "active" })
      .sort({ submittedAt: -1 }) // Sort by creation date, newest first
      .limit(limit)
      .select("name username currentRole bio yearsOfExperience profileImage")
      
  }

  //dashboard
  async getDashboardTotalMentors(): Promise<number> {
    return Mentor.countDocuments({ status: "active" });
  }

  
}
