import { NextFunction, Request, RequestHandler, Response } from "express";
import cloudinary from "../../config/cloudinary";
import { AuthRequest } from "../../types/custom";
import { userService } from "../../services/user.service";
import { IUserController } from "../../core/interfaces/controller/IUserController";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUserService } from "../../core/interfaces/service/IUserService";
import asyncHandler from "express-async-handler";
import { ParamsDictionary } from "express-serve-static-core";
import { CourseDTO, CoursesResponseDTO } from "../../dtos/response/course.dto";
// const UserService = new userService();

export interface CourseFilter {
  q?: string;
  category?: string[];
  tags?: string[];
  ratingMin?: number;
  level?: string[];
  priceMin?: number;
  priceMax?: number;
  duration?: string[];
  selectedPriceOptions?: string[];
  page: number;
  limit: number;
}

injectable();
export class UserController implements IUserController {
  constructor(@inject(TYPES.UserService) private userService: IUserService) {}

  getUserProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = String(req.user?._id);

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await this.userService.getUserProfile(userId);

    if (user.status === "blocked") {
      res.status(403).json({ message: "you have been blocked" });
      return;
    }

    res.status(200).json({ user });
  });

  updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    console.log("update profile controller");

    const userId = String(req.user?._id);
    console.log("userId from update controlled", userId);

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { name, title } = req.body;
    console.log(req.body, "req.body");

    if (!name || !title) {
      res.status(400).json({ message: "Name and title are required" });
      return;
    }

    const updateData: { profileImageUrl?: string; name: string; title: string } = {
      name,
      title,
    };

    console.log(req.file, "req file from front end");

    if (req.files && (req.files as { [fieldname: string]: Express.Multer.File[] }).profileImage) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] }; // Explicitly define type

      console.log("Uploading profile image to Cloudinary...");

      await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "mentor_profiles" }, (error, result) => {
            if (error) {
              console.error("Cloudinary upload error (profile image):", error);
              reject(error);
              return;
            }
            if (result) {
              updateData.profileImageUrl = result.secure_url;
              resolve(result);
            }
          })
          .end(files.profileImage[0].buffer);
      });
    }

    const response = await this.userService.updateUser(userId, updateData);
    res.status(200).json({ message: "User updated successfully", user: response });
  });

  getAllCourse = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const filter: CourseFilter = {
      q: req.query.q as string,
      category: req.query.category ? (req.query.category as string).split(",") : undefined,
      tags: req.query.tags ? (req.query.tags as string).split(",") : undefined,
      ratingMin: req.query.ratingMin ? parseFloat(req.query.ratingMin as string) : undefined,
      level: req.query.level ? (req.query.level as string).split(",") : undefined,
      priceMin: req.query.priceMin ? parseFloat(req.query.priceMin as string) : undefined,
      priceMax: req.query.priceMax ? parseFloat(req.query.priceMax as string) : undefined,
      duration: req.query.duration ? (req.query.duration as string).split(",") : undefined,
      selectedPriceOptions: req.query.selectedPriceOptions ? (req.query.selectedPriceOptions as string).split(",") : undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
    };

    const { courses, total } = await this.userService.getAllCourse(filter);

    const response: CoursesResponseDTO = {
    courses: CourseDTO.fromCourses(courses),
    total,
    page: filter.page,
    limit: filter.limit,
  };

    res.status(200).json(response);
  });

  getNotifications = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = String(req.user?._id);
    console.log("log from getnotification controller");

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const notifications = await this.userService.getNotifications(userId);

    res.status(200).json({ notifications });
  });

  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = String(req.user?._id);
    const { currentPassword, newPassword } = req.body;
    console.log(currentPassword, newPassword, "old and new pass form changepassword");
    let done = await this.userService.changePassword(userId, currentPassword, newPassword);
    // console.log(done,"this is from done");

    res.status(200).json({ message: "password changed success" });
  });
}
