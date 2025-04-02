import { ICourse } from "../../../models/Course";

export interface PaymentDetails {
    isPaid: boolean;
    courseId: string;
    amount: number;
    couponCode?: string;
    paymentIntent: string;
  }


export interface IPaymentService{
    createCheckoutSession({ courseId, amount, couponCode ,userId}: { courseId: string; amount: number; couponCode?: string;userId:string }):Promise<{ url: string; sessionId: string }>
    verifyAndSavePayment(sessionId: string, userId: string, courseData: ICourse):Promise<PaymentDetails>
}