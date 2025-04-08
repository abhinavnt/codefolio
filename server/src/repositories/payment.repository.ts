import Stripe from "stripe";
import { IPaymentRepository } from "../core/interfaces/repository/IPaymentRepository";
import { stripe } from "../config/stripe";
import { CoursePurchased, ICoursePurchased } from "../models/CoursePurchased";
import { IPurchasedCourseTask, PurchasedCourseTasks } from "../models/PurchasedCourseTasks";









export class PaymentRepository implements IPaymentRepository{

    async createCheckoutSession({ courseId, amount, couponCode, }: { courseId: string; amount: number; couponCode?: string; }): Promise<Stripe.Checkout.Session> {
        console.log(amount,"amount from repository");
        
        return await stripe.checkout.sessions.create({
         payment_method_types:['card','amazon_pay'],
         line_items:[{
            price_data:{
                currency:'inr',
                product_data:{
                    name:`Course Purchase-${courseId}`,
                    metadata:{courseId}
                },
                unit_amount:amount*100,
            },
            quantity:1,
         }],
         mode:'payment',
         success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&course_id=${courseId}`,
         cancel_url:`${process.env.CLIENT_URL}/payment/cancel`,
         metadata:{
            courseId,
            couponCode:couponCode||'none'
         }
        })
    }


    async getPaymentSession(sessionId: string): Promise<Stripe.Checkout.Session> {
        return await stripe.checkout.sessions.retrieve(sessionId)
    }


    async savePurchase(purchaseData: Partial<ICoursePurchased>): Promise<ICoursePurchased> {
        console.log("save purchase repository",purchaseData);
        
        const purchase= new CoursePurchased(purchaseData);
        return await purchase.save()
    }


    async savePurchasedTasks(tasks: Partial<IPurchasedCourseTask>[]): Promise<IPurchasedCourseTask[]> {

        return await PurchasedCourseTasks.insertMany(tasks) as IPurchasedCourseTask[]
      }
      

    async checkPurchaseId(paymentIntent: string): Promise<ICoursePurchased|null> {
        return await CoursePurchased.findOne({'paymentDetails.paymentIntent':paymentIntent})
        
    }


}