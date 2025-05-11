import mongoose, { Schema, Document } from "mongoose";

export interface IPayoutRequest extends Document {
  requestId: string;
  mentorId: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: string;
  paymentDetails: {
    accountNumber?: string;
    bankName?: string;
    ifscCode?: string;
    accountName?: string;
    upiId?: string;
  };
  status: "pending" | "paid" | "rejected";
  requestedAt: Date;
  processedAt?: Date;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PayoutRequestSchema = new Schema<IPayoutRequest>(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      default: () => `PAY-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    },
    mentorId: { type: Schema.Types.ObjectId, ref: "Mentor", required: true },
    amount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, required: true, enum: ["bank", "upi"] },
    paymentDetails: {
      accountNumber: { type: String },
      bankName: { type: String },
      ifscCode: { type: String },
      accountName: { type: String },
      upiId: { type: String },
    },
    status: {
      type: String,
      enum: ["pending", "paid", "rejected"],
      default: "pending",
      required: true,
    },
    requestedAt: { type: Date, required: true, default: Date.now },
    processedAt: { type: Date },
    adminNotes: { type: String },
  },
  { timestamps: true }
);

PayoutRequestSchema.index({ mentorId: 1, requestedAt: -1 });

export const PayoutRequest = mongoose.model<IPayoutRequest>("PayoutRequest", PayoutRequestSchema);