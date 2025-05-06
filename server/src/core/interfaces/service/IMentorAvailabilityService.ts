import { IMentorSpecificDateAvailability } from "../../../models/MentorAvailability";



export interface IMentorAvailabilityService{
    getMentorAvailability(mentorId: string): Promise<any>
    addMentorAvailability(
        mentorId: string,
        specificDateAvailability: { date: Date; timeSlots: { startTime: string; endTime: string; booked: boolean }[] }[]
      ): Promise<any>;
      editMentorAvailability(
        id: string,
        specificDateAvailability: { date: Date; timeSlots: { startTime: string; endTime: string; booked: boolean }[] }
      ): Promise<any>;
      getAllAvailableSlots(): Promise<any[]>
      bookTimeSlot(
        mentorId: string,
        date: string,
        startTime: string,
        endTime: string,
        userId: string,
        taskId: string
      ): Promise<IMentorSpecificDateAvailability>
}