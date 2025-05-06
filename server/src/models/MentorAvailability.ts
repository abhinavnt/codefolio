import mongoose, { Schema, Document } from "mongoose";

export interface ITimeSlot {
  startTime: string;
  endTime: string;
  booked: boolean;
  userId?: string; // Reference to the user who booked the slot
  taskId?: string; // Reference to the task associated with the booking
  practicalMarks?: number; // Marks for practical assessment
  theoryMarks?: number; // Marks for theoretical assessment
  feedback?: string; // Feedback provided by the mentor
  roomId?: string;
}

export interface ISpecificDateAvailability {
  date: Date;
  timeSlots: ITimeSlot[];
}

export interface IMentorSpecificDateAvailability extends Document {
  mentorId: string;
  specificDateAvailability: ISpecificDateAvailability;
}

const TimeSlotSchema = new Schema({
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  booked: { type: Boolean, default: false },
  userId: { type: String, ref: "User" },
  taskId: { type: String, ref: "Task" },
  practicalMarks: { type: Number },
  theoryMarks: { type: Number },
  feedback: { type: String },
  roomId: { type: String },
});

const SpecificDateAvailabilitySchema = new Schema({
  date: { type: Date, required: true },
  timeSlots: [TimeSlotSchema],
});

const MentorSpecificDateAvailabilitySchema = new Schema<IMentorSpecificDateAvailability>({
  mentorId: { type: String, required: true, ref: "Mentor" },
  specificDateAvailability: { type: SpecificDateAvailabilitySchema, required: true },
});

export const MentorSpecificDateAvailability = mongoose.model<IMentorSpecificDateAvailability>(
  "MentorSpecificDateAvailability",
  MentorSpecificDateAvailabilitySchema
);