import Stripe from "stripe";
import { IBookingRepository } from "../core/interfaces/repository/IBookingRepository";
import { Booking, IBooking } from "../models/Booking";
// import { Mentor } from "../models/Mentor";
import { startOfDay, endOfDay, getDay } from "date-fns";
import { stripe } from "../config/stripe";
import mongoose from "mongoose";
import { BaseRepository } from "../core/abstracts/base.repository";
import { getDateRange } from "../utils/dateUtils";

export class BookingRepository extends BaseRepository<IBooking> implements IBookingRepository {
  constructor() {
    super(Booking);
  }

  async findBooking(mentorId: string, date: string, startTime: string, endTime: string): Promise<IBooking | null> {
    console.log("findbooking repositroy reached");

    return await this.findOne({ mentorId, date: new Date(date), startTime, endTime, paymentStatus: "completed" });
  }

  async createBookingCheckoutSession({
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
  }): Promise<Stripe.Checkout.Session> {
    console.log("createbookin repository", mentorId);

    return await stripe.checkout.sessions.create({
      payment_method_types: ["card", "amazon_pay"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "mentor slot booking",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/booking/cancel`,
      metadata: {
        mentorId,
        date,
        startTime,
        endTime,
      },
    });
  }

  async getBookingPaymentSession(sessionId: string): Promise<Stripe.Checkout.Session> {
    return await stripe.checkout.sessions.retrieve(sessionId);
  }

  async createBooking(bookingData: Partial<IBooking>): Promise<IBooking> {
    const booking = new this.model(bookingData);
    return await booking.save();
  }

  async getBookingsByMentorId(mentorId: string): Promise<IBooking[]> {
    console.log("getBookingsByMentorId");

    return this.find({ mentorId: new mongoose.Types.ObjectId(mentorId) })
      .populate("userId", "name email image")
      .exec();
  }

  async getBookingsByUserId(userId: string): Promise<IBooking[]> {
    return await this.find({ userId: userId }).populate("mentorId", "name profileImage specialty");
  }

  async updateBooking(bookingId: string, updateData: Partial<IBooking>): Promise<IBooking | null> {
    return await this.model.findByIdAndUpdate(bookingId, updateData, { new: true }).exec();
  }

//dashboard
   async getMentorDashboardBookings(mentorId: string, startDate?: Date, endDate?: Date): Promise<any> {
    const query: any = { mentorId };
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    }
    return this.find(query)
      .sort({ date: -1 })
      .lean();
  }

  async getMentorshipSessionsCount(userId: string, period: "daily" | "weekly" | "monthly" | "yearly" | "all"): Promise<number> {
    const query: any = { userId, status: "completed" };
    
    if (period !== "all") {
      const { startDate, endDate } = getDateRange(period);
      query.createdAt = { $gte: startDate, $lte: endDate };
    }

    return this.countDocuments(query);
  }


}
