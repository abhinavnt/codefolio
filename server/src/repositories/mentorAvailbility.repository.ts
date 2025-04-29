import mongoose, { Types } from "mongoose";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IMentorAvailabilityReposiotry } from "../core/interfaces/repository/IMentoryAvailbilityRepository";
import { IMentorSpecificDateAvailability, MentorSpecificDateAvailability } from "../models/MentorAvailability";

export class MentorAvailabilityRepository extends BaseRepository<IMentorSpecificDateAvailability> implements IMentorAvailabilityReposiotry {
  constructor() {
    super(MentorSpecificDateAvailability);
  }

  async findByMentorId(mentorId: string): Promise<IMentorSpecificDateAvailability[]> {
    return this.find({ mentorId }).exec();
  }

  async upsert(
    mentorId: string,
    specificDateAvailability: { date: Date; timeSlots: { startTime: string; endTime: string; booked: boolean }[] }
  ): Promise<IMentorSpecificDateAvailability> {
    const existing = await this.findOne({ mentorId, "specificDateAvailability.date": specificDateAvailability.date });

    if (existing) {
      existing.specificDateAvailability.timeSlots = specificDateAvailability.timeSlots;
      return existing.save();
    }

    return this.create({
      mentorId,
      specificDateAvailability,
    });
  }

  async updateAvailability(
    id: string,
    specificDateAvailability: { date: Date; timeSlots: { startTime: string; endTime: string; booked: boolean }[] }
  ): Promise<IMentorSpecificDateAvailability | null> {
    const updated = await this.findByIdAndUpdate( new mongoose.Types.ObjectId(id), { specificDateAvailability }, { new: true });
    return updated;
  }
}
