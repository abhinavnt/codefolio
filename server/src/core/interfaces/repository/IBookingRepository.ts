import Stripe from "stripe";
import { IBooking } from "../../../models/Booking";






export interface IBookingRepository{
    getAvailableSlots(mentorId: string,from: Date,to: Date): Promise<{ date: string; day: string; timeSlots: { startTime: string; endTime: string }[] }[]>
    // bookTimeSlot(mentorId: string,date: Date,startTime: string, endTime: string): Promise<void>
    createBookingCheckoutSession({mentorId,date,startTime, endTime, amount,}: {
        mentorId: string
        date: string
        startTime: string
        endTime: string
        amount: number
      }): Promise<Stripe.Checkout.Session>
      getBookingPaymentSession(sessionId: string): Promise<Stripe.Checkout.Session>
      createBooking(bookingData: Partial<IBooking>): Promise<IBooking>
      findBooking(mentorId: string, date: string, startTime: string, endTime: string):Promise<IBooking|null>
}