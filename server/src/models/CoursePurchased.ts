import mongoose, { Document, Schema, Types } from "mongoose";

export interface ICoursePurchased extends Document {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
  paymentDetails: {
    amount: number;
    paymentIntent: string;
    couponCode?: string;
    paymentDate: Date;
  };
  courseData: {
    title: string;
    description: string;
    category: string;
    level: "beginner" | "intermediate" | "advanced";
    duration: string;
    image: string;
    price: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const coursePurchasedSchema = new Schema<ICoursePurchased>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    paymentDetails: {
      amount: { type: Number, required: true },
      paymentIntent: { type: String, required: true },
      couponCode: { type: String },
      paymentDate: { type: Date, default: Date.now },
    },
    courseData: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      category: { type: String, required: true },
      level: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
      duration: { type: String, required: true },
      image: { type: String, required: true },
      price: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const CoursePurchased = mongoose.model<ICoursePurchased>("CoursePurchased", coursePurchasedSchema);
