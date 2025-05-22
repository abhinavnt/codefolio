import { inject, injectable } from "inversify";

import { format, isSameDay } from "date-fns";

import mongoose from "mongoose";
import { IBookingService } from "../core/interfaces/service/IBookingServie";
import { TYPES } from "../di/types";
import { IMentorRepository } from "../core/interfaces/repository/IMentorRepository";
import { IBookingRepository } from "../core/interfaces/repository/IBookingRepository";
import { IBooking } from "../models/Booking";
import { IPurchaseHistoryRepository } from "../core/interfaces/repository/IPurchaseHistory.repository";
import { IMentorWalletRepository } from "../core/interfaces/repository/IMentorWalletRepository";

injectable();
export class BookingService implements IBookingService {
  constructor(
    @inject(TYPES.BookingRepository) private bookingRepository: IBookingRepository,
    @inject(TYPES.MentorRepository) private mentorRepository: IMentorRepository,
    @inject(TYPES.PurchaseHistoryRepository) private purchaseHistoryRepository: IPurchaseHistoryRepository,
    @inject(TYPES.MentorWalletRepository) private mentorWalletRepository: IMentorWalletRepository
  ) {}

  async getAvailability(
    mentorId: string,
    from: string,
    to: string
  ): Promise<{ date: string; day: string; timeSlots: { startTime: string; endTime: string }[] }[]> {
    const ogMentorId = await this.mentorRepository.findByUsername(mentorId);
    if (!ogMentorId) {
      throw new Error("mentor not found");
    }
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return this.mentorRepository.getAvailableSlots(ogMentorId._id as string, fromDate, toDate);
  }

  async createBookingCheckoutSession({
    mentorusername,
    userId,
    date,
    startTime,
    endTime,
    amount,
  }: {
    mentorusername: string;
    userId: string;
    date: string;
    startTime: string;
    endTime: string;
    amount: number;
  }): Promise<{ url: string; sessionId: string }> {
    const mentor = await this.mentorRepository.findByUsername(mentorusername);
    if (!mentor) throw new Error("Mentor not found");

    const isAvailble = await this.checkSlotAvailability(mentor._id as string, date, startTime, endTime);
    

    if (!isAvailble) throw new Error("Slot is not available");

    const session = await this.bookingRepository.createBookingCheckoutSession({
      mentorId: String(mentor._id),
      date,
      startTime,
      endTime,
      amount,
    });

    

    await this.purchaseHistoryRepository.createPurchaseHistory({
      userId,
      purchaseType: "mentorSlot",
      itemId: String(mentor._id),
      invoiceId: `INV-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      title: `Mentor Session with ${mentorusername} on ${date}`,
      price: 500,
      status: "Completed",
      purchaseDate: new Date(),
    });

    

    await this.mentorWalletRepository.createTransaction({
      mentorId: String(mentor._id),
      date: new Date(),
      description: `Payment for session with user on ${date}`,
      amount: 450,
      type: "credit",
    });

    

    return { url: session.url!, sessionId: session.id! };
  }

  async checkSlotAvailability(mentorId: string, date: string, startTime: string, endTime: string): Promise<boolean> {
    const existingBooking = await this.bookingRepository.findBooking(mentorId, date, startTime, endTime);
    

    if (existingBooking) return false;

    const mentor = await this.mentorRepository.findByMentorID(mentorId);
    

    if (!mentor) return false;

    const targetDate = new Date(date);
    const dayOfWeek = format(targetDate, "EEEE");

    const specificDateAvail = mentor.specificDateAvailability.find((avail) => isSameDay(avail.date, targetDate));
    if (specificDateAvail) {
      const slot = specificDateAvail.timeSlots.find((slot) => slot.startTime === startTime && slot.endTime === endTime && !slot.booked);
      return !!slot;
    }

    const weeklyAvail = mentor.weeklyAvailability.find((avail) => avail.day === dayOfWeek);
    if (weeklyAvail) {
      const slot = weeklyAvail.timeSlots.find((slot) => slot.startTime === startTime && slot.endTime === endTime && !slot.booked);
      return !!slot;
    }

    return false;
  }

  async verifyAndSaveBooking(sessionId: string, userId: string): Promise<IBooking> {
    const session = await this.bookingRepository.getBookingPaymentSession(sessionId);
    if (session.payment_status !== "paid") throw new Error("Payment not completed");
    const { mentorId, date, startTime, endTime } = session.metadata!;
    

    

    const isAvailable = await this.checkSlotAvailability(mentorId, date, startTime, endTime);
    

    if (!isAvailable) throw new Error("Slot is no longer available");
    

    const bookingData = {
      mentorId: new mongoose.Types.ObjectId(mentorId),
      userId: new mongoose.Types.ObjectId(userId),
      date: new Date(date),
      startTime,
      endTime,
      paymentStatus: "completed" as "completed",
      totalPrice: session.amount_total! / 100,
    };

    

    await this.markSlotAsBooked(mentorId, date, startTime, endTime);

    const booking = await this.bookingRepository.createBooking(bookingData);

    return booking;
  }

  async markSlotAsBooked(mentorId: string, date: string, startTime: string, endTime: string): Promise<void> {
    const mentor = await this.mentorRepository.findByMentorID(mentorId);
    if (!mentor) throw new Error("Mentor not found");

    const targetDate = new Date(date);
    const dayOfWeek = format(targetDate, "EEEE");

    let specificDateAvail = mentor.specificDateAvailability.find((avail) => isSameDay(avail.date, targetDate));
    if (specificDateAvail) {
      const slot = specificDateAvail.timeSlots.find((slot) => slot.startTime === startTime && slot.endTime === endTime);
      if (slot) {
        slot.booked = true;
        await mentor.save();
        return;
      }
    } else {
      const weeklyAvail = mentor.weeklyAvailability.find((avail) => avail.day === dayOfWeek);
      if (weeklyAvail) {
        const slot = weeklyAvail.timeSlots.find((slot) => slot.startTime === startTime && slot.endTime === endTime);
        if (slot) {
          mentor.specificDateAvailability.push({
            date: targetDate,
            timeSlots: [{ startTime, endTime, booked: true }],
          });
          await mentor.save();
          return;
        }
      }
    }

    throw new Error("Slot not found");
  }

  async getMentorBookings(mentorId: string): Promise<any[]> {
    const mentor = await this.mentorRepository.findByUserId(mentorId);
    const bookings = await this.bookingRepository.getBookingsByMentorId(mentor?._id as string);
    return bookings.map((booking) => ({
      id: booking._id,
      mentorId: mentor?._id,
      userId: (booking.userId as any)._id,
      studentName: (booking.userId as any).name,
      studentEmail: (booking.userId as any).email,
      studentImage: (booking.userId as any).image || "/placeholder.svg?height=40&width=40",
      date: booking.date.toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
      startTime: booking.startTime,
      endTime: booking.endTime,
      purpose: "Mentoring session",
      status: booking.status,
      paymentStatus: this.determineStatus(booking),
      totalPrice: booking.totalPrice || 0,
      feedback: booking.feedback,
      cancellationReason: booking.cancellationReason,
      rescheduleRequests: booking.rescheduleRequests?.map((req) => ({
        requester: req.requester,
        newDate: req.newDate.toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
        newStartTime: req.newStartTime,
        newEndTime: req.newEndTime,
        reason: req.reason,
        status: req.status,
        requestedAt: req.requestedAt,
      })),
      isRescheduled: booking.isRescheduled || false,
    }));
  }

  private determineStatus(booking: IBooking): "upcoming" | "completed" | "cancelled" {
    const now = new Date();
    const bookingDateTime = new Date(`${booking.date.toDateString()} ${booking.startTime}`);
    if (booking.paymentStatus === "failed") return "cancelled";
    if (bookingDateTime < now && booking.paymentStatus === "completed") return "completed";
    return "upcoming";
  }

  async getUserBookings(userId: string): Promise<IBooking[]> {
    return await this.bookingRepository.getBookingsByUserId(userId);
  }

  async cancelBooking(bookingId: string, cancellationReason: string): Promise<IBooking> {
    try {
      const booking = await this.bookingRepository.updateBooking(bookingId, { status: "cancelled", cancellationReason });
      if (!booking) throw new Error("Booking not found");

      return booking;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async completeBooking(bookingId: string, feedback: string): Promise<IBooking> {
    try {
      const booking = await this.bookingRepository.updateBooking(bookingId, { status: "completed", feedback });
      if (!booking) throw new Error("Booking not found");
      return booking;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async editFeedback(bookingId: string, feedback: string): Promise<IBooking> {
    try {
      const booking = await this.bookingRepository.updateBooking(bookingId, { feedback });
      if (!booking) throw new Error("Booking not found");
      return booking;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async requestReschedule(
    bookingId: string,
    requester: "user" | "mentor",
    newDate: string,
    newStartTime: string,
    newEndTime: string,
    reason: string
  ): Promise<IBooking> {
    try {
      const booking = await this.bookingRepository.findByBookingId(bookingId);
      if (!booking) throw new Error("Booking not found");
      if (booking.status !== "pending") throw new Error("Only pending bookings can be rescheduled");

      const rescheduleRequest = await this.bookingRepository.createRescheduleRequest(bookingId, {
        requester,
        newDate: new Date(newDate),
        newStartTime,
        newEndTime,
        reason,
      });

      if (!rescheduleRequest) throw new Error("Failed to create reschedule request");

      return rescheduleRequest;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async respondToRescheduleRequest(bookingId: string, requestIndex: number, status: "accepted" | "rejected"): Promise<IBooking> {
    try {
      const booking = await this.bookingRepository.findByBookingId(bookingId);
      if (!booking) throw new Error("Booking not found");
      if (!booking.rescheduleRequests || requestIndex >= booking.rescheduleRequests.length) {
        throw new Error("Invalid reschedule request");
      }

      const updatedBooking = await this.bookingRepository.updateRescheduleRequest(bookingId, requestIndex, status);
      if (!updatedBooking) throw new Error("Failed to update reschedule request");

      return updatedBooking;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
}
