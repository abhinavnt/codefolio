import { BaseRepository } from "../core/abstracts/base.repository";
import { IPurchaseCourseRepository } from "../core/interfaces/repository/IPurchasedCourse";
import { CoursePurchased, ICoursePurchased } from "../models/CoursePurchased";

export class PurchaseCourseRepository extends BaseRepository<ICoursePurchased> implements IPurchaseCourseRepository {
  constructor() {
    super(CoursePurchased);
  }
  async findCoursePurchaseByUserId(userId: string): Promise<ICoursePurchased[]> {
    return CoursePurchased.find({ userId }).exec();
  }
}
