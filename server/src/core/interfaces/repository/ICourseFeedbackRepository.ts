import { ICourseFeedback } from "../../../models/CourseFeedback";



export interface ICourseFeedbackRepository{
    findByCourseId(courseId: string): Promise<ICourseFeedback[]>
    findOneByCourseIdAndUserId(courseId: string, userId: string): Promise<ICourseFeedback | null>
    create(data: Partial<ICourseFeedback>): Promise<ICourseFeedback>;
    updateByCourseIdAndUserId(courseId: string, userId: string, data: Partial<ICourseFeedback>): Promise<ICourseFeedback | null>;
}