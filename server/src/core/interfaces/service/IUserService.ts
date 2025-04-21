import { CourseFilter } from "../../../controllers/user/user.controller";
import { ICourse } from "../../../models/Course";
import { IUser } from "../../../models/User";

export interface IUserService {
  updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser>;
  
//   changePassword(userId: string,currentPassword: string,newPassword: string): Promise<IUser>;

  getUserProfile(userId: string): Promise<IUser>;

  getAllCourse(filter: CourseFilter): Promise<{ courses: ICourse[], total: number }>

  getNotifications(userId:string):Promise<IUser['notifications']>
  
  changePassword(userId:string,oldPass:string,newPass:string):Promise<Boolean|null>
}