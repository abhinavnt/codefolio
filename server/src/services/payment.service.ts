import { inject, injectable } from "inversify";

import { Types } from "mongoose";
import { TYPES } from "../di/types";
import { IPaymentService, PaymentDetails } from "../core/interfaces/service/IPaymentService";
import { IPaymentRepository } from "../core/interfaces/repository/IPaymentRepository";
import { ITaskRepository } from "../core/interfaces/repository/ITaskRepository";
import { ICourseRepository } from "../core/interfaces/repository/ICourseRepository";
import { ICourse } from "../models/Course";
import { IPurchasedTaskRepository } from "../core/interfaces/repository/IPurchaseTaskReposioty";






@injectable()
export class PaymentService implements IPaymentService{
    constructor(@inject(TYPES.PaymentRepository) private paymentRepository:IPaymentRepository,
                @inject(TYPES.TaskRepository) private taskRepository:ITaskRepository,
                @inject(TYPES.CourseRepository) private courseRepository:ICourseRepository,
                @inject(TYPES.PurchaseTaskRepository) private purchaseTaskRepository:IPurchasedTaskRepository
){}



   async createCheckoutSession({ courseId, amount, couponCode,userId }: { courseId: string; amount: number; couponCode?: string; userId:string }): Promise<{ url: string; sessionId: string; }> {
       try {

        console.log(amount,"amoun from service");
        
         const isUserAlredyEnrolled= await  this.courseRepository.isUserEnrolled(courseId,userId)

         if(isUserAlredyEnrolled){
            throw new Error('alredy enrolled in course')
         }


        if(amount<=0){
            throw new Error('Invalid payment amount')
        }
       
        const session= await this.paymentRepository.createCheckoutSession({courseId,amount,couponCode})
        return {url:session.url!,sessionId:session.id!}
   

       } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
       }
   }


   async verifyAndSavePayment(sessionId: string, userId: string, courseData:ICourse): Promise<PaymentDetails> {
    console.log('payment verify service',courseData);
    
       try {
        const session= await this.paymentRepository.getPaymentSession(sessionId)
        const paymentDetails:PaymentDetails={
            isPaid: session.payment_status === 'paid',
            courseId: session.metadata!.courseId,
            amount: session.amount_total! / 100,
            couponCode: session.metadata!.couponCode,
            paymentIntent: session.payment_intent as string,
        }

        if (!paymentDetails.isPaid) {
            throw new Error('Payment not completed');
          }


          const existingPurchase=await this.paymentRepository.checkPurchaseId(paymentDetails.paymentIntent)

          if (existingPurchase) {
            console.log('Purchase already exists for paymentIntent:', paymentDetails.paymentIntent);
            return paymentDetails;  
          }



          const purchaseData = { 
            userId: new Types.ObjectId(userId), 
            courseId: new Types.ObjectId(paymentDetails.courseId), 
            paymentDetails: { 
                amount: paymentDetails.amount, 
                paymentIntent: paymentDetails.paymentIntent, 
                couponCode: paymentDetails.couponCode, 
                paymentDate: new Date()  
            },
            courseData: { 
                title: courseData.title, 
                description: courseData.description,  
                level: courseData.level as 'beginner' | 'intermediate' | 'advanced', 
                category: courseData.category, 
                duration: courseData.duration, 
                image: courseData.image, 
                price: courseData.price 
            } 
        };

        const savedPurchase= await this.paymentRepository.savePurchase(purchaseData)

        if(!savedPurchase){
            throw new Error('No course found for the course');
        }

        const orginalTasks=await this.taskRepository.getCourseTasks(paymentDetails.courseId)

        if (!orginalTasks) {
            throw new Error('No tasks found for the course');
        }

        const purchasedTask=orginalTasks.map(task=>({
            userId: new Types.ObjectId(userId),
            courseId: new Types.ObjectId(paymentDetails.courseId),
            // purchaseId: new Types.ObjectId(savedPurchase._id), 
            title: task.title,
            description: task.description,
            video: task.video,
            lessons: task.lessons,
            order: task.order,
            duration: task.duration,
            completed: false,
            status: task.status as 'active' | 'inactive',
            resources: task.resources,
            createdAt: new Date(), 
            updatedAt: new Date()  
        }))

        

        await this.purchaseTaskRepository.savePurchasedTasks(purchasedTask)

        await this.courseRepository.addStudentToCourse(courseData._id as string,userId)

        return paymentDetails
          
       } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
       }
   }







}








