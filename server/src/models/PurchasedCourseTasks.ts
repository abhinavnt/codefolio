import mongoose, { Document, Schema, Types } from "mongoose";

export interface IPurchasedCourseTask extends Document {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  // purchaseId: Types.ObjectId;
  title: string;
  description: string;
  video: string;
  lessons: string[];
  order: number;
  duration: string;
  status: "active" | "inactive";
  resources: string[];
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const purchasedCourseTasksSchema = new Schema<IPurchasedCourseTask>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    // purchaseId: { type: Schema.Types.ObjectId, ref: 'CoursePurchased', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    video: { type: String, default: "" },
    lessons: [{ type: String }],
    order: { type: Number, required: true },
    duration: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    resources: [{ type: String }],
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const PurchasedCourseTasks = mongoose.model<IPurchasedCourseTask>("PurchasedCourseTasks", purchasedCourseTasksSchema);
