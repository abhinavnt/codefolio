export interface IWishlistService {
  isCourseInWishlist(userId: string, courseId: string): Promise<boolean>;
  addCourseToWishlist(userId: string, courseId: string): Promise<void>;
  removeCourseFromWishlist(userId: string, courseId: string): Promise<void>;
}
