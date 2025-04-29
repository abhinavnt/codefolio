import { inject, injectable } from "inversify";
import { IMentorAvailabilityService } from "../core/interfaces/service/IMentorAvailabilityService";
import { TYPES } from "../di/types";
import { IMentorAvailabilityReposiotry } from "../core/interfaces/repository/IMentoryAvailbilityRepository";
import { isAfter, parse } from "date-fns";

@injectable()
export class MentorAvailabilityService implements IMentorAvailabilityService {
  constructor(@inject(TYPES.MentorAvailabilityRepository) private mentorAvailabilityReposiotry: IMentorAvailabilityReposiotry) {}

  async getMentorAvailability(mentorId: string): Promise<any> {
    const availability = await this.mentorAvailabilityReposiotry.findByMentorId(mentorId);
    return {
      data: availability.map((entry) => ({
        _id: entry._id,
        mentorId: entry.mentorId,
        specificDateAvailability: {
          date: entry.specificDateAvailability.date,
          timeSlots: entry.specificDateAvailability.timeSlots,
        },
      })),
    };
  }

  async addMentorAvailability(
    mentorId: string,
    specificDateAvailability: { date: Date; timeSlots: { startTime: string; endTime: string; booked: boolean }[] }[]
  ): Promise<any> {
    for (const day of specificDateAvailability) {
      for (const slot of day.timeSlots) {
        const startTime = parse(slot.startTime, "HH:mm", new Date());
        const endTime = parse(slot.endTime, "HH:mm", new Date());
        if (!isAfter(endTime, startTime)) {
          throw new Error(`Invalid time slot on ${day.date}: End time must be after start time.`);
        }
      }
      // Check for overlapping slots
      for (let i = 0; i < day.timeSlots.length; i++) {
        for (let j = i + 1; j < day.timeSlots.length; j++) {
          const slot1 = day.timeSlots[i];
          const slot2 = day.timeSlots[j];
          const start1 = parse(slot1.startTime, "HH:mm", new Date());
          const end1 = parse(slot1.endTime, "HH:mm", new Date());
          const start2 = parse(slot2.startTime, "HH:mm", new Date());
          const end2 = parse(slot2.endTime, "HH:mm", new Date());
          if ((start1 <= start2 && start2 < end1) || (start1 < end2 && end2 <= end1) || (start2 <= start1 && start1 < end2)) {
            throw new Error(`Overlapping time slots on ${day.date}.`);
          }
        }
      }
    }

    const results = [];
    for (const day of specificDateAvailability) {
      const result = await this.mentorAvailabilityReposiotry.upsert(mentorId, day);
      results.push(result);
    }

    return {
      data: results.map((entry) => ({
        _id: entry._id,
        mentorId: entry.mentorId,
        specificDateAvailability: {
          date: entry.specificDateAvailability.date,
          timeSlots: entry.specificDateAvailability.timeSlots,
        },
      })),
    };
  }


  async editMentorAvailability(
    id: string,
    specificDateAvailability: { date: Date; timeSlots: { startTime: string; endTime: string; booked: boolean }[] }
  ): Promise<any> {
    // Validate time slots
    for (const slot of specificDateAvailability.timeSlots) {
      const startTime = parse(slot.startTime, "HH:mm", new Date());
      const endTime = parse(slot.endTime, "HH:mm", new Date());
      if (!isAfter(endTime, startTime)) {
        throw new Error(`Invalid time slot on ${specificDateAvailability.date}: End time must be after start time.`);
      }
    }
    // Check for overlapping slots
    for (let i = 0; i < specificDateAvailability.timeSlots.length; i++) {
      for (let j = i + 1; j < specificDateAvailability.timeSlots.length; j++) {
        const slot1 = specificDateAvailability.timeSlots[i];
        const slot2 = specificDateAvailability.timeSlots[j];
        const start1 = parse(slot1.startTime, "HH:mm", new Date());
        const end1 = parse(slot1.endTime, "HH:mm", new Date());
        const start2 = parse(slot2.startTime, "HH:mm", new Date());
        const end2 = parse(slot2.endTime, "HH:mm", new Date());
        if (
          (start1 <= start2 && start2 < end1) ||
          (start1 < end2 && end2 <= end1) ||
          (start2 <= start1 && start1 < end2)
        ) {
          throw new Error(`Overlapping time slots on ${specificDateAvailability.date}.`);
        }
      }
    }

    const updated = await this.mentorAvailabilityReposiotry.updateAvailability(id, specificDateAvailability);
    if (!updated) {
      throw new Error("Availability entry not found");
    }

    return {
      data: {
        _id: updated._id,
        mentorId: updated.mentorId,
        specificDateAvailability: {
          date: updated.specificDateAvailability.date,
          timeSlots: updated.specificDateAvailability.timeSlots,
        },
      },
    };
  }




}
