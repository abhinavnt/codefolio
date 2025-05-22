import { inject, injectable } from "inversify";
import { IBookingController } from "../../core/interfaces/controller/IBookingController";
import { TYPES } from "../../di/types";
import { IBookingService } from "../../core/interfaces/service/IBookingServie";
import asyncHandler from "express-async-handler";
import { Request, RequestHandler, Response } from "express";

@injectable()
export class BookingController implements IBookingController {
  constructor(@inject(TYPES.BookingService) private bookinService: IBookingService) {}

  getMentorAvailability = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;
    const { from, to } = req.query;
    

    const availability = await this.bookinService.getAvailability(username, from as string, to as string);

    res.status(200).json(availability);
  });

  createCheckoutSession = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = String(req.user?._id);

    const { mentorusername, date, startTime, endTime } = req.body;
    

    if (!mentorusername || !date || !startTime || !endTime) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const sessionData = await this.bookinService.createBookingCheckoutSession({
      mentorusername,
      userId,
      date,
      startTime,
      endTime,
      amount: 50000,
    });

    res.status(200).json(sessionData);
  });

  verifyPayment = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { session_id } = req.query;
    const userId = String(req.user?._id);
    

    if (!session_id) {
      res.status(400).json({ error: "Missing session_id" });
      return;
    }

    const booking = await this.bookinService.verifyAndSaveBooking(session_id as string, userId);

    res.status(200).json({ message: "Booking successful", booking });
  });

  getMentorBookings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = String(req.user?._id);
    const bookings = await this.bookinService.getMentorBookings(userId);
    res.status(200).json(bookings);
  });

  getUserBookings = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = String(req.user?._id);
    const bookings = await this.bookinService.getUserBookings(userId);
    res.status(200).json(bookings);
  });

  cancelBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { bookingId } = req.params;
    const { cancellationReason } = req.body;
    if (!cancellationReason) {
      res.status(400).json({ error: "Cancellation reason is required" });
      return;
    }
    const booking = await this.bookinService.cancelBooking(bookingId, cancellationReason);
    res.status(200).json({ message: "Booking cancelled successfully", booking });
  });

  completeBooking = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { bookingId } = req.params;
    const { feedback } = req.body;
    if (!feedback) {
      res.status(400).json({ error: "Feedback is required" });
      return;
    }
    const booking = await this.bookinService.completeBooking(bookingId, feedback);
    res.status(200).json({ message: "Booking marked as completed", booking });
  });

  editFeedback = asyncHandler(async (req: Request, res: Response) => {
    const { bookingId } = req.params;
    const { feedback } = req.body;
    if (!feedback) {
      res.status(400).json({ error: "Feedback is required" });
      return;
    }
    const booking = await this.bookinService.editFeedback(bookingId, feedback);
    res.status(200).json({ message: "Feedback updated successfully", booking });
  });

  requestReschedule = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { bookingId } = req.params;
    const { requester, newDate, newStartTime, newEndTime, reason } = req.body;

    if (!requester || !newDate || !newStartTime || !newEndTime || !reason) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const booking = await this.bookinService.requestReschedule(bookingId, requester, newDate, newStartTime, newEndTime, reason);
    res.status(200).json({ message: "Reschedule request created successfully", booking });
  });

  respondToRescheduleRequest = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { bookingId, requestIndex } = req.params;
    const { status } = req.body;

    if (!status || !["accepted", "rejected"].includes(status)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }

    const booking = await this.bookinService.respondToRescheduleRequest(bookingId, parseInt(requestIndex), status);
    res.status(200).json({ message: `Reschedule request ${status}`, booking });
  });
}
