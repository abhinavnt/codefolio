import { Interface } from "readline";
import Stripe from "stripe";
import { ICoursePurchased } from "../../../models/CoursePurchased";
import { IPurchasedCourseTask } from "../../../models/PurchasedCourseTasks";





export interface IPaymentRepository{
    createCheckoutSession({courseId,amount,couponCode,}: {courseId: string;amount: number;couponCode?: string;}):Promise<Stripe.Checkout.Session> 
    getPaymentSession(sessionId:string):Promise<Stripe.Checkout.Session>
    savePurchase(purchaseData:Partial<ICoursePurchased>):Promise<ICoursePurchased> 
    savePurchasedTasks(tasks:Partial<IPurchasedCourseTask>[]):Promise<IPurchasedCourseTask[]>
    checkPurchaseId(paymentIntent:string ):Promise<ICoursePurchased|null>
}