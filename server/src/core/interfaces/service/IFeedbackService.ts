import { ICourseFeedback } from "../../../models/CourseFeedback";
import { IMentorFeedback } from "../../../models/MentorFeedback";


export interface IFeedbackService{
    submitFeedback(feedbackData: Partial<IMentorFeedback>): Promise<IMentorFeedback|null>
    getFeedbackByMentorId(mentorId: string,page:number,limit:number,excludeUserId?: string,rating?: number): Promise<{ feedback: IMentorFeedback[]; total: number }> 
    getFeedbackByUserId(userId: string): Promise<IMentorFeedback[]>
    submitCourseFeedback(userId: string, courseId: string, rating: number, feedback: string): Promise<ICourseFeedback|null>;
    getFeedbackByCourseAndUser(courseId: string, userId: string): Promise<ICourseFeedback | null>
    getFeedbackByCourseId(courseId:string):Promise<ICourseFeedback[]>
}