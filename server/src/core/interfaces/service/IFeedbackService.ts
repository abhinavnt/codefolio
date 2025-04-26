import { IMentorFeedback } from "../../../models/MentorFeedback";


export interface IFeedbackService{
    submitFeedback(feedbackData: Partial<IMentorFeedback>): Promise<IMentorFeedback|null>
    getFeedbackByMentorId(mentorId: string,page:number,limit:number,excludeUserId?: string,rating?: number): Promise<{ feedback: IMentorFeedback[]; total: number }> 
    getFeedbackByUserId(userId: string): Promise<IMentorFeedback[]>
}