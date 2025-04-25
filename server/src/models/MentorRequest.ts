import mongoose, { Schema, Document } from "mongoose";

// Enum for mentor request status
enum MentorRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface IMentorRequest extends Document {
  userId: string;
  profileImage?: string;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  yearsOfExperience: number;
  currentCompany: string;
  currentRole: string;
  durationAtCompany: string;
  resume: string;
  technicalSkills: string[];
  primaryLanguage: string;
  bio: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
  status: MentorRequestStatus;
  submittedAt: Date;
  updatedAt?: Date;
}

const MentorRequestSchema = new Schema<IMentorRequest>(
  {
    userId: { type: String, required: true },
    profileImage: { type: String },
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    yearsOfExperience: { type: Number, required: true },
    currentCompany: { type: String, required: true },
    currentRole: { type: String, required: true },
    durationAtCompany: { type: String, required: true },
    resume: { type: String, required: true },
    technicalSkills: { type: [String], required: true },
    primaryLanguage: { type: String, required: true },
    bio: { type: String, required: true },
    linkedin: { type: String },
    github: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    status: {
      type: String,
      enum: Object.values(MentorRequestStatus),
      default: MentorRequestStatus.PENDING,
    },
  },
  { timestamps: true }
);

export const MentorRequest = mongoose.model<IMentorRequest>("MentorRequest", MentorRequestSchema);
