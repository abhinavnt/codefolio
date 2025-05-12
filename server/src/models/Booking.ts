import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  mentorId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  paymentStatus: "pending" | "completed" | "failed";
  status: "pending" | "completed" | "cancelled";
  totalPrice: number;
  feedback?: string;
  cancellationReason?: string;
  rescheduleRequests?: {
    requester: "user" | "mentor";
    newDate: Date;
    newStartTime: string;
    newEndTime: string;
    reason: string;
    status: "pending" | "accepted" | "rejected";
    requestedAt: Date;
  }[];
  isRescheduled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    mentorId: { type: Schema.Types.ObjectId, ref: "Mentor", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    totalPrice: { type: Number, required: true },
    feedback: { type: String, required: false },
    cancellationReason: { type: String, required: false },
    rescheduleRequests: [
      {
        requester: {
          type: String,
          enum: ["user", "mentor"],
          required: true,
        },
        newDate: { type: Date, required: true },
        newStartTime: { type: String, required: true },
        newEndTime: { type: String, required: true },
        reason: { type: String, required: true },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
        requestedAt: { type: Date, default: Date.now },
      },
    ],
    isRescheduled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>("Booking", BookingSchema);