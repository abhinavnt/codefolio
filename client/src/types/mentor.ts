
export interface IAvailableTimeSlot {
    date: Date;
    day: string;
    availableTimes: string[];
  }




export interface IMentor {
    _id:string
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
  