import { BaseRepository } from "../core/abstracts/base.repository";
import { IWishlistRepository } from "../core/interfaces/repository/IWishlistRepository";
import { IWishlist, Wishlist } from "../models/Wishlist";

export class WishlistRepository extends BaseRepository<IWishlist> implements IWishlistRepository {
  constructor() {
    super(Wishlist);
  }

  async getWishlistByUserId(userId: string): Promise<IWishlist | null> {
    return this.findOne({ userId });
  }

  async addCourseToWishlist(userId: string, courseId: string): Promise<IWishlist> {
    return this.findOneAndUpdate({ userId }, { $addToSet: { courseIds: courseId } }, { new: true, upsert: true });
  }

  async removeCourseFromWishlist(userId: string, courseId: string): Promise<IWishlist> {
    return this.findOneAndUpdate({ userId }, { $pull: { courseIds: courseId } }, { new: true });
  }

  async isCourseInWishlist(userId: string, courseId: string): Promise<boolean> {
    const wishlist = await this.findOne({ userId, courseIds: courseId });
    return !!wishlist;
  }
}
