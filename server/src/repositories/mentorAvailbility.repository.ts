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
    const updated = await this.findByIdAndUpdate(new mongoose.Types.ObjectId(id), { specificDateAvailability }, { new: true });
    return updated;
  }

  async findAllWithMentor(): Promise<IMentorSpecificDateAvailability[]> {
    return this.find({}).populate("mentorId");
  }

  async bookAvailbleTimeSlot(
    mentorId: string,
    date: string,
    startTime: string,
    endTime: string,
    userId: string,
    taskId: string,
    roomId:string
  ): Promise<IMentorSpecificDateAvailability | null> {
    if (!mentorId || !date || !startTime || !endTime || !userId || !taskId) {
      throw new Error("All fields (mentorId, date, startTime, endTime, userId, taskId) are required");
    }
  
    console.log('Input data:', { mentorId, date, startTime, endTime, userId, taskId });
  
    // Format date to match database
    const formattedDate = new Date(date).toISOString().split("T")[0];
    const isoDate = new Date(formattedDate + "T00:00:00.000Z"); // Ensure consistent time
    console.log('Formatted date:', isoDate);
  
    // Log query conditions
    console.log('Query conditions:', {
      mentorId,
      date: isoDate,
      startTime,
      endTime,
      booked: false,
    });
  
    // Check if document exists
    const existingDoc = await this.findOne({
      mentorId,
      "specificDateAvailability.date": isoDate,
    });
    console.log('Existing document:', existingDoc);
  
    const result = await this.findOneAndUpdate(
      {
        mentorId,
        "specificDateAvailability.date": isoDate,
        "specificDateAvailability.timeSlots": {
          $elemMatch: {
            startTime,
            endTime,
            booked: false,
          },
        },
      },
      {
        $set: {
          "specificDateAvailability.timeSlots.$.booked": true,
          "specificDateAvailability.timeSlots.$.userId": userId,
          "specificDateAvailability.timeSlots.$.taskId": taskId,
          "specificDateAvailability.timeSlots.$.practicalMarks": undefined,
          "specificDateAvailability.timeSlots.$.theoryMarks": undefined,
          "specificDateAvailability.timeSlots.$.feedback": undefined,
          "specificDateAvailability.timeSlots.$.roomId": roomId
        },
      },
      { new: true }
    );
  
    console.log('Update result:', result);
  
    if (!result) {
      console.log('No matching time slot found or already booked');
      return null;
    }
  
    return result;
  }
  
}
