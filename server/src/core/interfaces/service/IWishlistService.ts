import { IWishlist } from "../../../models/Wishlist";

export interface IWishlistService {
  isCourseInWishlist(userId: string, courseId: string): Promise<boolean>;
  addCourseToWishlist(userId: string, courseId: string): Promise<void>;
  removeCourseFromWishlist(userId: string, courseId: string): Promise<void>;
  getWishlist(userId: string): Promise<IWishlist | null>
}
