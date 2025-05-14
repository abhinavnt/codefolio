import mongoose, { FilterQuery, Types } from "mongoose";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IMentorAvailabilityReposiotry } from "../core/interfaces/repository/IMentoryAvailbilityRepository";
import { IMentorSpecificDateAvailability, MentorSpecificDateAvailability } from "../models/MentorAvailability";
import { ITimeSlot } from "../models/Mentor";

interface IUpdateQuery {
  $set: {
    "specificDateAvailability.timeSlots.$[slot].status": string;
    "specificDateAvailability.timeSlots.$[slot].practicalMarks"?: number;
    "specificDateAvailability.timeSlots.$[slot].theoryMarks"?: number;
    "specificDateAvailability.timeSlots.$[slot].feedback"?: string;
  };
}

export class MentorAvailabilityRepository extends BaseRepository<IMentorSpecificDateAvailability> implements IMentorAvailabilityReposiotry {
  constructor() {
    super(MentorSpecificDateAvailability);
  }

  async findByMentorId(mentorId: string): Promise<IMentorSpecificDateAvailability[]> {
    return this.find({ mentorId }).exec();
  }

  async addTimeSlot(
    mentorId: string,
    date: Date,
    timeSlot: { startTime: string; endTime: string; booked: boolean }
  ): Promise<IMentorSpecificDateAvailability> {
    const filter = { mentorId, "specificDateAvailability.date": date };
    const update = {
      $push: { "specificDateAvailability.timeSlots": timeSlot },
    };
    const options = { upsert: true, new: true };
    return this.findOneAndUpdate(filter, update, options);
  }

  async editTimeSlot(
    mentorId: string,
    date: Date,
    timeSlotId: string,
    updatedTimeSlot: { startTime: string; endTime: string; booked: boolean }
  ): Promise<IMentorSpecificDateAvailability | null> {
    const normalizedDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

    const filterCheck = {
      mentorId,
      "specificDateAvailability.date": normalizedDate,
      "specificDateAvailability.timeSlots._id": new mongoose.Types.ObjectId(timeSlotId),
    };

    const existingDoc = await this.findOne(filterCheck);
    if (!existingDoc) {
      console.log("No document found for filter:", filterCheck);
      throw new Error("No document found with matching mentorId, date, or timeSlotId. Verify the inputs and database data.");
    }

    // Perform the update
    const filter = {
      mentorId,
      "specificDateAvailability.date": normalizedDate,
      "specificDateAvailability.timeSlots._id": new mongoose.Types.ObjectId(timeSlotId),
    };

    const update = {
      $set: {
        "specificDateAvailability.timeSlots.$.startTime": updatedTimeSlot.startTime,
        "specificDateAvailability.timeSlots.$.endTime": updatedTimeSlot.endTime,
        "specificDateAvailability.timeSlots.$.booked": updatedTimeSlot.booked,
      },
    };

    const options = {
      new: true,
    };

    try {
      const result = await this.findOneAndUpdate(filter, update, options);
      if (!result) {
        console.log("No document updated for filter:", filter);
        throw new Error("Failed to update the time slot. No matching document found.");
      }

      return result;
    } catch (error) {
      console.error("Error in editTimeSlot:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async deleteTimeSlot(mentorId: string, date: Date, timeSlotId: string): Promise<IMentorSpecificDateAvailability | null> {
    const filter = { mentorId, "specificDateAvailability.date": date };
    const update = {
      $pull: { "specificDateAvailability.timeSlots": { _id: new mongoose.Types.ObjectId(timeSlotId) } },
    };
    return this.findOneAndUpdate(filter, update, { new: true });
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
    roomId: string
  ): Promise<IMentorSpecificDateAvailability | null> {
    if (!mentorId || !date || !startTime || !endTime || !userId || !taskId) {
      throw new Error("All fields (mentorId, date, startTime, endTime, userId, taskId) are required");
    }

    console.log("Input data:", { mentorId, date, startTime, endTime, userId, taskId });

    // Format date to match database
    const formattedDate = new Date(date).toISOString().split("T")[0];
    const isoDate = new Date(formattedDate + "T00:00:00.000Z"); // Ensure consistent time
    console.log("Formatted date:", isoDate);

    // Log query conditions
    console.log("Query conditions:", {
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
    console.log("Existing document:", existingDoc);

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
          "specificDateAvailability.timeSlots.$.roomId": roomId,
        },
      },
      { new: true }
    );

    console.log("Update result:", result);

    if (!result) {
      console.log("No matching time slot found or already booked");
      return null;
    }

    return result;
  }

  //booked
  async findTimeSlotsByStatus(mentorId: string, status: string): Promise<any[]> {
    const availabilities = await this.find({ mentorId }).exec();
    console.log("availablityids", availabilities);

    const timeSlots = [];
    for (const availability of availabilities) {
      const date = availability.specificDateAvailability.date;
      const slots = availability.specificDateAvailability.timeSlots.filter((slot) => slot.booked && slot.status === status);
      for (const slot of slots) {
        timeSlots.push({
          date,
          timeSlot: slot,
        });
      }
    }
    return timeSlots;
  }

  async updateTimeSlotStatus(
    mentorId: string,
    date: Date,
    timeSlotId: string,
    status: string,
    marks?: { practical: number; theory: number },
    feedback?: string
  ): Promise<ITimeSlot | null> {
    const update: IUpdateQuery = {
      $set: {
        "specificDateAvailability.timeSlots.$[slot].status": status,
      },
    };
    if (marks) {
      update.$set["specificDateAvailability.timeSlots.$[slot].practicalMarks"] = marks.practical;
      update.$set["specificDateAvailability.timeSlots.$[slot].theoryMarks"] = marks.theory;
    }
    if (feedback) {
      update.$set["specificDateAvailability.timeSlots.$[slot].feedback"] = feedback;
    }
    const result = await MentorSpecificDateAvailability.findOneAndUpdate(
      {
        mentorId,
        "specificDateAvailability.date": date,
      },
      update,
      {
        arrayFilters: [{ "slot._id": timeSlotId }],
        new: true, // Return the updated document
      }
    );
    if (result) {
      const specificDateAvailability = result.specificDateAvailability;
      const timeSlot = specificDateAvailability.timeSlots.find((slot) => slot._id?.toString() === timeSlotId);
      return timeSlot || null;
    }
    return null;
  }

  //dashboard
  async getDashboardUpcomingAvailability(mentorId: string, startDate?: Date, endDate?: Date): Promise<IMentorSpecificDateAvailability[]> {
    const query: FilterQuery<IMentorSpecificDateAvailability> = { mentorId };
    if (startDate && endDate) {
      query["specificDateAvailability.date"] = { $gte: startDate, $lte: endDate };
    } else {
      query["specificDateAvailability.date"] = { $gte: new Date() };
    }
    return this.find(query).sort({ "specificDateAvailability.date": 1 }).limit(10);
  }
}
