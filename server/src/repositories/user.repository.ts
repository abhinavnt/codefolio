import { IUserRepository } from "../core/interfaces/repository/IUserRepository";
import { IUser, User } from "../models/User";


export class UserRepository implements IUserRepository{

    async findUserById(userId: string):Promise<IUser| null> {
        return await User.findById(userId)
      }
    
    async updateById(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
      return await User.findByIdAndUpdate(userId, updateData, { new: true });
    }
   

  async updateReviewerRequestStatus(userId: string, status: "pending" | "approved" | "rejected"): Promise<boolean> {
    try {
      const result = await User.findByIdAndUpdate(
        userId,
        { $set: { reviewerRequestStatus: [status] } }, // Replacing array with a single value
        { new: true } // Return updated document
      );

      return result !== null; // Return true if update was successful, otherwise false
    } catch (error) {
      console.error("Error updating reviewer request status:", error);
      throw new Error("Database update failed");
    }
  }

      
}