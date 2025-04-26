import { IMentorFeedback } from "../../../models/MentorFeedback";


export interface IFeedbackService{
    submitFeedback(feedbackData: Partial<IMentorFeedback>): Promise<IMentorFeedback|null>
    getFeedbackByMentorId(mentorId: string): Promise<IMentorFeedback[]> 
    getFeedbackByUserId(userId: string): Promise<IMentorFeedback[]>
}