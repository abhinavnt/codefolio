import mongoose, { Schema, Document } from "mongoose";

export interface ITimeSlot {
  startTime: string;
  endTime: string;
  booked: boolean;
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