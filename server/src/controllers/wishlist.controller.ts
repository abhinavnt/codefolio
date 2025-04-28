import { IWishlistController } from "../core/interfaces/controller/IWishlistController";
import asyncHandler from "express-async-handler";
import { TYPES } from "../di/types";
import { inject, injectable } from "inversify";
import { IWishlistService } from "../core/interfaces/service/IWishlistService";
import { Request, RequestHandler, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

@injectable()
export class WishistController implements IWishlistController {
  constructor(@inject(TYPES.WishlistService) private wishlistService: IWishlistService) {}

  getWishlistStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = String(req.user?._id);
    const courseId = req.params.courseId;
    const isWishlisted = await this.wishlistService.isCourseInWishlist(userId, courseId);
    res.status(200).json({ isWishlisted });
  });

  addToWishlist = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = String(req.user?._id);
    const courseId = req.params.courseId;
    await this.wishlistService.addCourseToWishlist(userId, courseId);
    res.status(201).json({ success: true });
  });

  removeFromWishlist = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = String(req.user?._id);
    const courseId = req.params.courseId;
    await this.wishlistService.removeCourseFromWishlist(userId, courseId);
    res.status(200).json({ success: true });
  });

  getWishlist = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = String(req.user?._id);
    const wishlist = await this.wishlistService.getWishlist(userId);
    if (wishlist) {
      res.status(200).json(wishlist);
    } else {
      res.status(404).json({ message: "Wishlist not found" });
    }
  });
}
