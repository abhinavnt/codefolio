import Stripe from "stripe";
import { IBooking } from "../../../models/Booking";

export interface IBookingRepository {
  // getAvailableSlots(mentorId: string,from: Date,to: Date): Promise<{ date: string; day: string; timeSlots: { startTime: string; endTime: string }[] }[]>
  // bookTimeSlot(mentorId: string,date: Date,startTime: string, endTime: string): Promise<void>
  createBookingCheckoutSession({
    mentorId,
    date,
    startTime,
    endTime,
    amount,
  }: {
    mentorId: string;
    date: string;
    startTime: string;
    endTime: string;
    amount: number;
  }): Promise<Stripe.Checkout.Session>;
  getBookingPaymentSession(sessionId: string): Promise<Stripe.Checkout.Session>;
  createBooking(bookingData: Partial<IBooking>): Promise<IBooking>;
  findBooking(mentorId: string, date: string, startTime: string, endTime: string): Promise<IBooking | null>;
  getBookingsByMentorId(mentorId: string): Promise<IBooking[]>;
  getBookingsByUserId(userId: string): Promise<IBooking[]>;
  updateBooking(bookingId: string, updateData: Partial<IBooking>): Promise<IBooking | null>;
  getMentorDashboardBookings(mentorId: string): Promise<any>;
  getMentorDashboardBookings(mentorId: string, startDate?: Date, endDate?: Date): Promise<any>;
  getMentorshipSessionsCount(userId: string, period: "daily" | "weekly" | "monthly" | "yearly" | "all"): Promise<number>;

  createRescheduleRequest(
    bookingId: string,
    requestData: {
      requester: "user" | "mentor";
      newDate: Date;
      newStartTime: string;
      newEndTime: string;
      reason: string;
    }
  ): Promise<IBooking | null>;

  updateRescheduleRequest(bookingId: string, requestIndex: number, status: "accepted" | "rejected"): Promise<IBooking | null>;

  findByBookingId(bookingId:string):Promise<IBooking|null>
}
