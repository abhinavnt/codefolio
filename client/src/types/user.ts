

export interface User  {
  _id:string
    name: string;
    email: string;
    profileImageUrl: string;
    status:string;
    role: string;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    wishlist:[];
    savedMentors:[];
    skills:string[];
    DOB:Date;
    reviewerRequestStatus: "pending" | "approved" | "rejected"[];
  }