import { IWishlist } from "../../../models/Wishlist";

export interface IWishlistRepository {
  getWishlistByUserId(userId: string): Promise<IWishlist | null>;
  addCourseToWishlist(userId: string, courseId: string): Promise<IWishlist>;
  removeCourseFromWishlist(userId: string, courseId: string): Promise<IWishlist>;
  isCourseInWishlist(userId: string, courseId: string): Promise<boolean>;
}
