import { IMentorSpecificDateAvailability } from "../../../models/MentorAvailability";


export interface IMentorAvailabilityReposiotry{
    findByMentorId(mentorId: string): Promise<IMentorSpecificDateAvailability[]>;
    upsert(
        mentorId: string,
        specificDateAvailability: { date: Date; timeSlots: { startTime: string; endTime: string; booked: boolean }[] }
      ): Promise<IMentorSpecificDateAvailability>;
      updateAvailability(
        id: string,
        specificDateAvailability: { date: Date; timeSlots: { startTime: string; endTime: string; booked: boolean }[] }
      ): Promise<IMentorSpecificDateAvailability | null>;
      findAllWithMentor(): Promise<IMentorSpecificDateAvailability[]>
      bookAvailbleTimeSlot(
        mentorId: string,
        date: string,
        startTime: string,
        endTime: string,
        userId: string,
        taskId: string,
        roomId:string,
      ): Promise<IMentorSpecificDateAvailability|null>
}