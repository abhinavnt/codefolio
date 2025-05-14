import mongoose from "mongoose";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IUserRepository } from "../core/interfaces/repository/IUserRepository";
import { IUser, User } from "../models/User";

export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(User);
  }
  async findUserById(userId: string): Promise<IUser | null> {
    return await this.findById(new mongoose.Types.ObjectId(userId));
  }

  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return await this.findOne({ googleId });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email });
  }

  async updateById(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await this.findByIdAndUpdate(new mongoose.Types.ObjectId(userId), updateData, { new: true });
  }

  async updateReviewerRequestStatus(userId: string, status: "pending" | "approved" | "rejected"): Promise<boolean> {
    try {
      const result = await this.findByIdAndUpdate(new mongoose.Types.ObjectId(userId), { $set: { reviewerRequestStatus: [status] } }, { new: true });

      return result !== null;
    } catch (error) {
      console.error("Error updating reviewer request status:", error);
      throw new Error("Database update failed");
    }
  }

  async addNotification(userId: string, message: string): Promise<Boolean | null> {
    let noti = await this.findByIdAndUpdate(
      new mongoose.Types.ObjectId(userId),
      {
        $push: { notifications: { message, createdAt: new Date() } },
      },
      { new: true }
    );

    if (noti) {
      return true;
    } else {
      return null;
    }
  }

  async getNotification(userId: string): Promise<IUser["notifications"]> {
    const user = await this.findUserById(userId);

    if (!user) {
      if (!user) throw new Error("User not found");
    }

    return user?.notifications.slice(0, 1000).reverse();
  }

  async changePassword(userId: string, newPass: string): Promise<Boolean | null> {
    console.log("user repository ethii");

    const changed = await this.findByIdAndUpdate(new mongoose.Types.ObjectId(userId), { password: newPass }, { new: true });
    if (changed) {
      return true;
    } else {
      return false;
    }
  }

  async updateUserMentorApplicationStatus(userId: string, status: string): Promise<IUser | null> {
    const user = (await this.findById(new mongoose.Types.ObjectId(userId))) as IUser | null;
    if (!user) {
      return null;
    }

    const existingStatusIndex = user.reviewerRequestStatus.findIndex((s) => s === "pending" || s === "approved" || s === "rejected");
    if (existingStatusIndex !== -1) {
      user.reviewerRequestStatus[existingStatusIndex] = status.toLowerCase() as "pending" | "approved" | "rejected";
    } else {
      user.reviewerRequestStatus.push(status.toLowerCase() as "pending" | "approved" | "rejected");
    }

    await user.save();

    return user;
  }

  async getallUsers(page: number, limit: number): Promise<{ allUsers: IUser[]; total: number }> {
    const skip = (page - 1) * limit;
    const requests = await this.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);

    const total = await this.countDocuments({});

    return { allUsers: requests, total };
  }

  async toggleUserStatus(userId: string): Promise<IUser | null> {
    console.log("user repository");
    console.log("User ID:", userId, typeof userId);

    const user: IUser | null = await this.findById(new mongoose.Types.ObjectId(userId));
    console.log(user, "user from rpo");

    if (!user) throw new Error("user not found");

    user.status = user.status === "active" ? "blocked" : "active";

    await user.save();

    return user;
  }


  //dashboard
  async getDashboardTotalUsers(): Promise<number> {
    return this.countDocuments({});
  }

}
