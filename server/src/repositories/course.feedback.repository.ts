import { BaseRepository } from "../core/abstracts/base.repository";
import { ICourseFeedbackRepository } from "../core/interfaces/repository/ICourseFeedbackRepository";
import { CourseFeedback, ICourseFeedback } from "../models/CourseFeedback";

export class CourseFeedbackRepository extends BaseRepository<ICourseFeedback> implements ICourseFeedbackRepository {
  constructor() {
    super(CourseFeedback);
  }

  async findByCourseId(courseId: string): Promise<ICourseFeedback[]> {
    return this.find({ courseId }).populate("userId", "name profileImageUrl");
  }

  async findOneByCourseIdAndUserId(courseId: string, userId: string): Promise<ICourseFeedback | null> {
    return this.findOne({ courseId, userId });
  }

  async create(data: Partial<ICourseFeedback>): Promise<ICourseFeedback> {
    const feedback = new this.model(data);
    return feedback.save();
  }

  async updateByCourseIdAndUserId(courseId: string, userId: string, data: Partial<ICourseFeedback>): Promise<ICourseFeedback | null> {
    return this.findOneAndUpdate({ courseId, userId }, data, { new: true });
  }
}
