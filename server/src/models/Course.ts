import mongoose, { Document, Schema, Types } from "mongoose";

// Interface for the Course document
export interface ICourse extends Document {
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  image: string;
  price: string;
  rating: number;
  enrolledStudents: Types.ObjectId[];
  status: "draft" | "published" | "archived";
  tags: string[];
  learningPoints: string[];
  targetedAudience: string[];
  courseRequirements: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the Course schema
const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    level: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
    duration: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    enrolledStudents: [{ type: Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    tags: [{ type: String }],
    learningPoints: [{ type: String }],
    targetedAudience: [{ type: String }],
    courseRequirements: [{ type: String }],
  },
  { timestamps: true }
);

export const Course = mongoose.model<ICourse>("Course", CourseSchema);
