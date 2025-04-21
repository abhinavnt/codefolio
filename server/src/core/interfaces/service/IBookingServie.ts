import { IBooking } from "../../../models/Booking";








export interface IBookingService{
    getAvailability(mentorId: string, from: string, to: string):Promise<{ date: string; day: string; timeSlots: { startTime: string; endTime: string }[] }[]>

    createBookingCheckoutSession({
        mentorusername,
        userId,
        date,
        startTime,
        endTime,
        amount,
      }: {
        mentorusername: string
        userId: string
        date: string
        startTime: string
        endTime: string
        amount: number
      }): Promise<{ url: string; sessionId: string }>

      checkSlotAvailability(mentorId: string, date: string, startTime: string, endTime: string): Promise<boolean>

      verifyAndSaveBooking(sessionId: string, userId: string): Promise<IBooking> 

      markSlotAsBooked(mentorId: string, date: string, startTime: string, endTime: string): Promise<void>

      getMentorBookings(mentorId: string): Promise<IBooking[]>

      getUserBookings(userId: string): Promise<IBooking[]>

      cancelBooking(bookingId: string, cancellationReason: string): Promise<IBooking>

      completeBooking(bookingId: string, feedback: string): Promise<IBooking>

      editFeedback(bookingId: string, feedback: string): Promise<IBooking>

}