import mongoose, { Document, Schema, Types } from "mongoose";

// Interface for a Lesson (used in the service for typing the incoming data)
export interface ILesson {
  title: string;
  duration: string;
  video: string;
}

// Interface for the Task document
export interface ITask extends Document {
  courseId: Types.ObjectId;
  title: string;
  description: string;
  video: string;
  lessons: string[]; // Array of strings
  order: number;
  duration: string;
  status: "active" | "inactive";
  resources: string[];
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    video: { type: String, default: "" },
    lessons: [{ type: String }],
    order: { type: Number, required: true },
    duration: { type: String },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    resources: [{ type: String }],
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", TaskSchema);