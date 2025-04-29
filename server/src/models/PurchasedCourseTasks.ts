import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPurchasedCourseTask extends Document {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  title: string;
  description: string;
  video: string;
  lessons: string[];
  order: number;
  duration: string;
  status: "active" | "inactive";
  reviewStatus: "PASS" | "FAIL";
  resources: string[];
  completed: boolean;
  reviewScheduled: boolean;
  attempts: {
    submissionDate: Date;
    review?: {
      mentorId: Types.ObjectId;
      theoryMarks: number;
      practicalMarks: number;
      result: "pass" | "fail";
      reviewDate: Date;
    };
  }[];
  meetId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const purchasedCourseTasksSchema = new Schema<IPurchasedCourseTask>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    video: { type: String, default: "" },
    lessons: [{ type: String }],
    order: { type: Number, required: true },
    duration: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    reviewStatus: { type: String, enum: ["PASS", "FAIL"], default: "FAIL" },
    resources: [{ type: String }],
    completed: { type: Boolean, default: false },
    reviewScheduled: {type: Boolean,default: false, required: true,},
    attempts: [
      {
        submissionDate: { type: Date, required: true },
        review: {
          mentorId: { type: Schema.Types.ObjectId, ref: "Mentor" },
          theoryMarks: { type: Number },
          practicalMarks: { type: Number },
          result: { type: String, enum: ["pass", "fail"] },
          reviewDate: { type: Date },
        },
      },
    ],
    meetId: { type: String },
  },
  { timestamps: true }
);

export const PurchasedCourseTasks = mongoose.model<IPurchasedCourseTask>("PurchasedCourseTasks", purchasedCourseTasksSchema);
