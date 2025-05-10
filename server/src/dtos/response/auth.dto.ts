export interface UserDto {
  _id: string;
  name: string;
  email: string;
  profileImageUrl: string;
  status: string;
  role: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  wishlist: any[];
  savedMentors: any[];
  skills: string[];
  DOB: Date;
  reviewerRequestStatus?: ("pending" | "approved" | "rejected")[]
}

export interface VerifiedUserDto {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}