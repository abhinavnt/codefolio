import { IMentor, ISpecificDateAvailability } from "../../models/Mentor";

// DTO for available time slots
interface IAvailableTimeSlotDTO {
  date: string;
  day: string;
  availableTimes: string[];
}

// DTO for a single mentor
export class MentorDTO {
  _id: string;
  userId: string;
  profileImage?: string;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
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
  availableTimeSlots?: IAvailableTimeSlotDTO[];
  title?: string;
  reviewTakenCount?: number;
  phone?: string;
  location?: string;

  constructor(mentor: IMentor) {
    this._id = mentor._id as string;
    this.userId = mentor.userId;
    this.profileImage = mentor.profileImage;
    this.name = mentor.name;
    this.username = mentor.username;
    this.email = mentor.email;
    this.phoneNumber = mentor.phoneNumber;
    this.dateOfBirth = mentor.dateOfBirth.toISOString();
    this.yearsOfExperience = mentor.yearsOfExperience;
    this.currentCompany = mentor.currentCompany;
    this.currentRole = mentor.currentRole;
    this.durationAtCompany = mentor.durationAtCompany;
    this.resume = mentor.resume;
    this.technicalSkills = mentor.technicalSkills;
    this.primaryLanguage = mentor.primaryLanguage;
    this.bio = mentor.bio;
    this.linkedin = mentor.linkedin;
    this.github = mentor.github;
    this.twitter = mentor.twitter;
    this.instagram = mentor.instagram;
    this.status = mentor.status;
    this.availableTimeSlots = this.mapAvailableTimeSlots(mentor.specificDateAvailability);
    this.title = mentor.title;
    this.reviewTakenCount = mentor.reviewTakenCount;
    this.phone = mentor.phone;
    this.location = mentor.location;
  }

  private mapAvailableTimeSlots(specificDateAvailability: ISpecificDateAvailability[]): IAvailableTimeSlotDTO[] {
    if (!specificDateAvailability || specificDateAvailability.length === 0) {
      return [];
    }

    return specificDateAvailability.map((slot) => ({
      date: slot.date.toISOString(),
      day: slot.date.toLocaleDateString("en-US", { weekday: "long" }),
      availableTimes: slot.timeSlots.filter((ts) => !ts.booked).map((ts) => `${ts.startTime}-${ts.endTime}`),
    }));
  }

  static fromMentors(mentors: IMentor[]): MentorDTO[] {
    return mentors.map((mentor) => new MentorDTO(mentor));
  }
}

// DTO for the full response
export interface MentorsResponseDTO {
  data: MentorDTO[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
