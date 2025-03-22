import { IUser } from "../../../models/User";

export interface IUserService {
  updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser>;
  
//   changePassword(userId: string,currentPassword: string,newPassword: string): Promise<IUser>;

  getUserProfile(userId: string): Promise<IUser>;

}