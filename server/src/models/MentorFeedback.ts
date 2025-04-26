import mongoose, { Schema, Document } from "mongoose";

export interface IMentorFeedback extends Document {
  mentorId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  feedback: string;
  createdAt: Date;
  updatedAt: Date;
}

const MentorFeedbackSchema = new Schema<IMentorFeedback>(
  {
    mentorId: { type: Schema.Types.ObjectId, ref: "Mentor", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String, required: true },
  },
  { timestamps: true }
);

export const MentorFeedback = mongoose.model<IMentorFeedback>("MentorFeedback", MentorFeedbackSchema);