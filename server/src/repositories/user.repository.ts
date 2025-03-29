import { IUserRepository } from "../core/interfaces/repository/IUserRepository";
import { Course, ICourse } from "../models/Course";
import { IUser, User } from "../models/User";


export class UserRepository implements IUserRepository{

    async findUserById(userId: string):Promise<IUser| null> {
        return await User.findById(userId)
      }

      async findByGoogleId(googleId: string): Promise<IUser | null> {
        return await User.findOne({ googleId });
      }

      async findByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email });
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

  async getAllCourses(): Promise<ICourse[] | null> {
      return await Course.find()
  }

   async addNotification(userId:string,message: string): Promise<Boolean|null> {
    return await User.findByIdAndUpdate(
      userId,
      {
        $push: { notifications: { message, createdAt: new Date() } }
      },
      { new: true }
    );
   }

   async getNotification(userId: string): Promise<IUser["notifications"]> {
       const user= await this.findUserById(userId)
      
       if(!user){
        if (!user) throw new Error("User not found");
       }

       return user?.notifications.slice(0,10).reverse()
   }

   async changePassword(userId: string, newPass: string): Promise<Boolean|null> {
    console.log('user repository ethii');
    
    return User.findByIdAndUpdate(userId,{password:newPass}, {new:true})
   }
   
   
}