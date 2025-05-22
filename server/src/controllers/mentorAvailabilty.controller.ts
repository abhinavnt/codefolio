import { inject, injectable } from "inversify";
import { IMentorAvailabilityController } from "../core/interfaces/controller/IMentorAvailabiltyController";
import { TYPES } from "../di/types";
import { IMentorAvailabilityService } from "../core/interfaces/service/IMentorAvailabilityService";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";

@injectable()
export class MentorAvailabilityController implements IMentorAvailabilityController {
  constructor(@inject(TYPES.MentorAvailabilityService) private mentorAvailability: IMentorAvailabilityService) {}

  getAvailability = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const mentorId = req.query.mentorId as string;
    if (!mentorId) {
      res.status(400).json({ error: "Mentor ID is required" });
      return;
    }
    const availability = await this.mentorAvailability.getMentorAvailability(mentorId);
    res.status(200).json(availability);
  });

  addTimeSlot = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId, date, timeSlot } = req.body;
    if (!mentorId || !date || !timeSlot) {
      res.status(400).json({ error: "Mentor ID, date, and timeSlot are required" });
      return;
    }
    const result = await this.mentorAvailability.addMentorTimeSlot(mentorId, new Date(date), timeSlot);
    res.status(200).json(result);
  });

  editTimeSlot = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId, date, timeSlotId, timeSlot } = req.body;
    if (!mentorId || !date || !timeSlotId || !timeSlot) {
      res.status(400).json({ error: "Mentor ID, date, timeSlotId, and timeSlot are required" });
      return;
    }
    const result = await this.mentorAvailability.editMentorTimeSlot(mentorId, new Date(date), timeSlotId, timeSlot);
    res.status(200).json(result);
  });

  deleteTimeSlot = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId, date, timeSlotId } = req.body;
    if (!mentorId || !date || !timeSlotId) {
      res.status(400).json({ error: "Mentor ID, date, and timeSlotId are required" });
      return;
    }
    const result = await this.mentorAvailability.deleteMentorTimeSlot(mentorId, new Date(date), timeSlotId);
    res.status(200).json(result);
  });

  getAllAvailableSlots = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const slots = await this.mentorAvailability.getAllAvailableSlots();
    res.status(200).json(slots);
  });

  bookSlot = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId, userId, taskId, date, startTime, endTime } = req.body;
    
    

    const result = await this.mentorAvailability.bookTimeSlot(mentorId, date, startTime, endTime, userId, taskId);

    res.status(200).json({ message: "Time slot booked successfully", data: result });
  });

  getReviews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const mentorId = req.params.mentorId;

    const status = req.query.status as string;

    if (!["upcoming", "completed", "canceled"].includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }
    const reviews = await this.mentorAvailability.getReviewsByStatus(mentorId, status);
    res.status(200).json(reviews);
  });

  completeReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId, date, timeSlotId } = req.params;

    const { practicalMarks, theoryMarks, feedback } = req.body;

    await this.mentorAvailability.markReviewAsCompleted(
      mentorId,
      new Date(date),
      timeSlotId,
      { practical: practicalMarks, theory: theoryMarks },
      feedback
    );

    res.status(201).json({ message: "Review marked as completed" });
  });

  cancelReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId, date, timeSlotId } = req.params;
    await this.mentorAvailability.markReviewAsCanceled(mentorId, new Date(date), timeSlotId);
    res.status(201).json({ message: "Review canceled" });
  });

  editReview = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId, date, timeSlotId } = req.params;

    const { practicalMarks, theoryMarks, feedback } = req.body;

    await this.mentorAvailability.editCompletedReview(
      mentorId,
      new Date(date),
      timeSlotId,
      { practical: practicalMarks, theory: theoryMarks },
      feedback
    );
    res.status(201).json({ message: "Review updated" });
  });
}
