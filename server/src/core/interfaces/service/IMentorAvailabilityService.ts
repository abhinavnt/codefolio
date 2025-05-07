import { IMentorSpecificDateAvailability } from "../../../models/MentorAvailability";

export interface IMentorAvailabilityService {
  getMentorAvailability(mentorId: string): Promise<any>;

  addMentorTimeSlot(mentorId: string, date: Date, timeSlot: { startTime: string; endTime: string; booked: boolean }): Promise<any>;

  editMentorTimeSlot(
    mentorId: string,
    date: Date,
    timeSlotId: string,
    updatedTimeSlot: { startTime: string; endTime: string; booked: boolean }
  ): Promise<any>;

  deleteMentorTimeSlot(mentorId: string, date: Date, timeSlotId: string): Promise<any>;

  getAllAvailableSlots(): Promise<any[]>;

  bookTimeSlot(
    mentorId: string,
    date: string,
    startTime: string,
    endTime: string,
    userId: string,
    taskId: string
  ): Promise<IMentorSpecificDateAvailability>;

  getReviewsByStatus(mentorId: string, status: string): Promise<any[]>;

  markReviewAsCompleted(
    mentorId: string,
    date: Date,
    timeSlotId: string,
    marks: { practical: number; theory: number },
    feedback: string
  ): Promise<void>;

  markReviewAsCanceled(mentorId: string, date: Date, timeSlotId: string): Promise<void>;

  editCompletedReview(
    mentorId: string,
    date: Date,
    timeSlotId: string,
    marks: { practical: number; theory: number },
    feedback: string
  ): Promise<void>;
}
