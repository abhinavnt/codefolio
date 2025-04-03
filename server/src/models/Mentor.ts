// models/Mentor.ts
import mongoose, { Schema, Document } from "mongoose";

// Interface for available time slots (exported)
export interface IAvailableTimeSlot {
  date: Date;
  day: string;
  availableTimes: string[];
}

// Interface for Mentor (extends Document for Mongoose)
export interface IMentor extends Document {
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
  status: "active" | "inactive";
  submittedAt: Date;
  updatedAt?: Date;
  availableTimeSlots?: IAvailableTimeSlot[];
  title?: string;
  reviewTakenCount?: number;
  phone?: string;
  location?: string;
}

// Interface for Mentor data (does not extend Document)
export interface IMentorData {
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
  status: "active" | "inactive";
  availableTimeSlots?: IAvailableTimeSlot[];
  title?: string;
  reviewTakenCount?: number;
  phone?: string;
  location?: string;
}

const MentorSchema = new Schema<IMentor>(
  {
    userId: { type: String, required: true },
    profileImage: { type: String },
    name: { type: String, required: true },
    username: { type: String, required: true ,unique:true},
    email: { type: String, required: true,unique:true },
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
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    availableTimeSlots: {
      type: [
        {
          date: { type: Date },
          day: { type: String },
          availableTimes: { type: [String] },
        },
      ],
      default: [],
    },
    title: { type: String },
    reviewTakenCount: { type: Number, default: 0 },
    phone: { type: String },
    location: { type: String },
  },
  { timestamps: { createdAt: "submittedAt", updatedAt: "updatedAt" } }
);

export const Mentor = mongoose.model<IMentor>("Mentor", MentorSchema);
