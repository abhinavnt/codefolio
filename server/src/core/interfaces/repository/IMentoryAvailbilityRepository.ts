
import { IMentorSpecificDateAvailability, ITimeSlot } from "../../../models/MentorAvailability";

export interface IMentorAvailabilityReposiotry {
  findByMentorId(mentorId: string): Promise<IMentorSpecificDateAvailability[]>;

  addTimeSlot(
    mentorId: string,
    date: Date,
    timeSlot: { startTime: string; endTime: string; booked: boolean }
  ): Promise<IMentorSpecificDateAvailability>

  editTimeSlot(
    mentorId: string,
    date: Date,
    timeSlotId: string,
    updatedTimeSlot: { startTime: string; endTime: string; booked: boolean }
  ): Promise<IMentorSpecificDateAvailability | null>

  deleteTimeSlot(
    mentorId: string,
    date: Date,
    timeSlotId: string
  ): Promise<IMentorSpecificDateAvailability | null>

  findAllWithMentor(): Promise<IMentorSpecificDateAvailability[]>;

  bookAvailbleTimeSlot(
    mentorId: string,
    date: string,
    startTime: string,
    endTime: string,
    userId: string,
    taskId: string,
    roomId: string
  ): Promise<IMentorSpecificDateAvailability | null>;

  findTimeSlotsByStatus(mentorId: string, status: string): Promise<any[]>;

  updateTimeSlotStatus(
    mentorId: string,
    date: Date,
    timeSlotId: string,
    status: string,
    marks?: { practical: number; theory: number },
    feedback?: string
  ): Promise<ITimeSlot|null>;
}
