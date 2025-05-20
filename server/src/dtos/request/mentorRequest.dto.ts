import { IMentorRequest } from "../../models/MentorRequest";

// mentorRequest.dto.ts
interface File {
  buffer: Buffer;
  mimetype: string;
}

export class MentorRequestDTO {
  // Required fields
  userId: string;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  yearsOfExperience: number;
  currentCompany: string;
  currentRole: string;
  durationAtCompany: string;
  resume: File | null; // Multer file for resume
  technicalSkills: string[];
  primaryLanguage: string;
  bio: string;

  // Optional fields
  profileImage?: File; // Multer file for profile image
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;

  constructor(data: Partial<MentorRequestDTO>, userId: string, files?: { profileImage?: File[]; resume?: File[] }) {
    // Assign userId
    this.userId = userId;

    // Required fields with validation
    this.name = this.validateString(data.name, "Name is required");
    this.username = this.validateString(data.username, "Username is required");
    this.email = this.validateEmail(data.email, "Valid email is required");
    this.phoneNumber = this.validateString(data.phoneNumber, "Phone number is required");
    this.dateOfBirth = this.validateDate(data.dateOfBirth, "Valid date of birth is required");
    this.yearsOfExperience = this.validateNumber(data.yearsOfExperience, "Years of experience is required");
    this.currentCompany = this.validateString(data.currentCompany, "Current company is required");
    this.currentRole = this.validateString(data.currentRole, "Current role is required");
    this.durationAtCompany = this.validateString(data.durationAtCompany, "Duration at company is required");
    this.technicalSkills = this.validateStringArray(data.technicalSkills, "Technical skills are required");
    this.primaryLanguage = this.validateString(data.primaryLanguage, "Primary language is required");
    this.bio = this.validateString(data.bio, "Bio is required");

    // File validation
    this.profileImage = files?.profileImage?.[0] && this.validateFile(files.profileImage[0], "profileImage");
    this.resume = files?.resume?.[0] ? this.validateFile(files.resume[0], "resume") : null;

    // Optional fields
    this.linkedin = data.linkedin ? this.validateString(data.linkedin, "Invalid LinkedIn URL") : undefined;
    this.github = data.github ? this.validateString(data.github, "Invalid GitHub URL") : undefined;
    this.twitter = data.twitter ? this.validateString(data.twitter, "Invalid Twitter URL") : undefined;
    this.instagram = data.instagram ? this.validateString(data.instagram, "Invalid Instagram URL") : undefined;
  }

  // Validation methods
  private validateString(value: any, errorMessage: string): string {
    if (typeof value !== "string" || value.trim() === "") {
      throw new Error(errorMessage);
    }
    return value.trim();
  }

  private validateEmail(value: any, errorMessage: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof value !== "string" || !emailRegex.test(value)) {
      throw new Error(errorMessage);
    }
    return value.trim();
  }

  private validateDate(value: any, errorMessage: string): Date {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error(errorMessage);
    }
    return date;
  }

  private validateNumber(value: any, errorMessage: string): number {
    const num = Number(value);
    if (isNaN(num) || num < 0) {
      throw new Error(errorMessage);
    }
    return num;
  }

  private validateStringArray(value: any, errorMessage: string): string[] {
    if (!Array.isArray(value) || value.length === 0 || !value.every((item) => typeof item === "string" && item.trim() !== "")) {
      throw new Error(errorMessage);
    }
    return value.map((item) => item.trim());
  }

  private validateFile(file: File, fieldName: string): File {
    const allowedTypes = fieldName === "profileImage" ? ["image/jpeg", "image/png"] : ["application/pdf"];
    if (!file || !allowedTypes.includes(file.mimetype)) {
      throw new Error(`Invalid file type for ${fieldName}. Allowed types: ${allowedTypes.join(", ")}`);
    }
    return file;
  }

  // Method to convert DTO to mentor request data for the service
  toMentorData(profileImageUrl: string = "", resumeUrl: string = ""): Partial<IMentorRequest> {
    return {
      userId: this.userId,
      profileImage: profileImageUrl,
      name: this.name,
      username: this.username,
      email: this.email,
      phoneNumber: this.phoneNumber,
      dateOfBirth: this.dateOfBirth,
      yearsOfExperience: this.yearsOfExperience,
      currentCompany: this.currentCompany,
      currentRole: this.currentRole,
      durationAtCompany: this.durationAtCompany,
      resume: resumeUrl,
     technicalSkills: this.technicalSkills,
      primaryLanguage: this.primaryLanguage,
      bio: this.bio,
      linkedin: this.linkedin,
      github: this.github,
      twitter: this.twitter,
      instagram: this.instagram,
    };
  }
}