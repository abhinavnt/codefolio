// const userRepository = new UserRepository();

import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IUserRepository } from "../core/interfaces/repository/IUserRepository";
import { IUserService } from "../core/interfaces/service/IUserService";
import { IUser } from "../models/User";
import { ICourse } from "../models/Course";
import bcrypt from "bcryptjs";
import { ICourseRepository } from "../core/interfaces/repository/ICourseRepository";
import { CourseFilter } from "../controllers/user/user.controller";
import { FilterQuery } from "mongoose";

injectable();
export class userService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.CourseRepository) private courseRepository: ICourseRepository
  ) {}
  async getUserProfile(userId: string): Promise<IUser> {
    try {
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new Error("invalid userId");
      }

      return user;
    } catch (error) {
      throw new Error("error while fetching user");
    }
  }

  async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser> {
    try {
      console.log("update service here");

      const user = await this.userRepository.updateById(userId, updateData);
      console.log(user);

      if (!user) {
        throw new Error("cannot update user. please try again");
      }
      return user;
    } catch (error) {
      throw new Error("error while updating user");
    }
  }

  async getAllCourse(filter: CourseFilter): Promise<{ courses: ICourse[]; total: number }> {
    try {
      const query: FilterQuery<ICourse> = { status: "published" };

      if (filter.q) {
        query.$or = [{ title: { $regex: filter.q, $options: "i" } }, { description: { $regex: filter.q, $options: "i" } }];
      }

      if (filter.category && filter.category.length > 0) {
        query.category = { $in: filter.category };
      }

      if (filter.tags && filter.tags.length > 0) {
        query.tags = { $in: filter.tags };
      }

      if (filter.ratingMin) {
        query.rating = { $gte: filter.ratingMin };
      }

      if (filter.level && filter.level.length > 0) {
        query.level = { $in: filter.level };
      }
      if (filter.duration && filter.duration.length > 0) {
        query.duration = { $in: filter.duration };
      }

      const priceConditions = [];
      if (filter.selectedPriceOptions?.includes("free")) {
        priceConditions.push({ price: "0" });
      }
      if (filter.selectedPriceOptions?.includes("paid")) {
        const paidCondition: any = { price: { $ne: "0" } };
        if (filter.priceMin !== undefined || filter.priceMax !== undefined) {
          const exprConditions = [];
          if (filter.priceMin !== undefined) {
            exprConditions.push({ $gte: [{ $toDouble: "$price" }, filter.priceMin] });
          }
          if (filter.priceMax !== undefined) {
            exprConditions.push({ $lte: [{ $toDouble: "$price" }, filter.priceMax] });
          }
          if (exprConditions.length > 0) {
            paidCondition.$expr = { $and: exprConditions };
          }
        }
        priceConditions.push(paidCondition);
      }
      if (priceConditions.length > 0) {
        if (priceConditions.length === 1) {
          Object.assign(query, priceConditions[0]);
        } else {
          query.$or = priceConditions;
        }
      }

      const page = filter.page || 1;
      const limit = filter.limit || 9;
      const skip = (page - 1) * limit;

      const courses = await this.courseRepository.getAllCourses(query, skip, limit);
      const total = await this.courseRepository.countCourses(query);

      return { courses, total };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async getNotifications(userId: string): Promise<IUser["notifications"]> {
    console.log("from getnotificatioon service");

    return await this.userRepository.getNotification(userId);
  }

  async changePassword(userId: string, oldPass: string, newPass: string): Promise<Boolean | null> {
    try {
      console.log("user serviceil kayritundd");

      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        throw new Error("user not found");
      }

      const isPasswordMatch = await bcrypt.compare(oldPass, user.password);

      console.log(isPasswordMatch, "ispasswordMatch");

      if (!isPasswordMatch) {
        throw new Error("password not matching");
      }

      const hashedPassword = await bcrypt.hash(newPass, 10);

      const passwrdChanged = await this.userRepository.changePassword(user.id, hashedPassword);

      console.log(passwrdChanged, "password changed from service");

      return passwrdChanged;
    } catch (error: any) {
      console.log(error);

      throw new Error(error);
    }
  }
}
