import mongoose, { Schema, Document } from "mongoose";

export interface ICourseFeedback extends Document {
  courseId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  feedback: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseFeedbackSchema = new Schema<ICourseFeedback>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String, required: true },
  },
  { timestamps: true }
);

// Ensure only one feedback per user per course
CourseFeedbackSchema.index({ courseId: 1, userId: 1 }, { unique: true });

export const CourseFeedback = mongoose.model<ICourseFeedback>("CourseFeedback", CourseFeedbackSchema);