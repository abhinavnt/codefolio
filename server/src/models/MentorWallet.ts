import mongoose, { Schema, Document } from "mongoose";

export interface IMentorWallet extends Document {
  transactionId: string;
  mentorId: mongoose.Types.ObjectId;
  date: Date;
  description: string;
  amount: number;
  type: "credit" | "debit";
  createdAt: Date;
  updatedAt: Date;
}

const MentorWalletSchema = new Schema<IMentorWallet>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      default: () => `TXN-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    },
    mentorId: { type: Schema.Types.ObjectId, ref: "Mentor", required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ["credit", "debit"], required: true },
  },
  { timestamps: true }
);

// Index to improve query performance for transactions by mentor
MentorWalletSchema.index({ mentorId: 1, date: -1 });

export const MentorWallet = mongoose.model<IMentorWallet>("MentorWallet", MentorWalletSchema);
