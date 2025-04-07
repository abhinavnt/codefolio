import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  mentorId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  paymentStatus: "pending" | "completed" | "failed";
  totalPrice: number;
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
    totalPrice: { type: Number, required: true }, 
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>("Booking", BookingSchema);