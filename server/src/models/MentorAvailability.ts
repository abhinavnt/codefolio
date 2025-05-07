import mongoose, { Schema, Document } from "mongoose";

export interface ITimeSlot {
  _id?: mongoose.Types.ObjectId
  startTime: string;
  endTime: string;
  booked: boolean;
  userId?: string;
  taskId?: string;
  practicalMarks?: number;
  theoryMarks?: number;
  feedback?: string;
  roomId?: string;
  status?: 'upcoming' | 'completed' | 'canceled';
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
  status: { type: String, enum: ['upcoming', 'completed', 'canceled'], default: 'upcoming' },
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