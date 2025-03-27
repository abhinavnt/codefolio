import { ICourse } from "../../../models/Course";
import { IUser } from "../../../models/User";

export interface IUserRepository {
    updateById(userId: string, updateData: Partial<IUser>): Promise<IUser | null>
    findUserById(userId: string):Promise<IUser| null>
    updateReviewerRequestStatus(userId: string, status: "pending" | "approved" | "rejected"): Promise<boolean>;
    findByGoogleId(googleId: string): Promise<IUser | null> 
    findByEmail(email: string): Promise<IUser | null> 
    getAllCourses():Promise<ICourse[]|null>
}