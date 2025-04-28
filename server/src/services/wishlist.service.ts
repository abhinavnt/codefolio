import { inject, injectable } from "inversify";
import { IWishlistService } from "../core/interfaces/service/IWishlistService";
import { TYPES } from "../di/types";
import { IWishlistRepository } from "../core/interfaces/repository/IWishlistRepository";
import { IWishlist } from "../models/Wishlist";

@injectable()
export class WishlistService implements IWishlistService {
  constructor(@inject(TYPES.WishlistRepository) private wishlistRepository: IWishlistRepository) {}

  async isCourseInWishlist(userId: string, courseId: string): Promise<boolean> {
    return this.wishlistRepository.isCourseInWishlist(userId, courseId);
  }

  async addCourseToWishlist(userId: string, courseId: string): Promise<void> {
    await this.wishlistRepository.addCourseToWishlist(userId, courseId);
  }

  async removeCourseFromWishlist(userId: string, courseId: string): Promise<void> {
    await this.wishlistRepository.removeCourseFromWishlist(userId, courseId);
  }

  async getWishlist(userId: string): Promise<IWishlist | null> {
      return this.wishlistRepository.getWishlistByUserId(userId)
  }
}
