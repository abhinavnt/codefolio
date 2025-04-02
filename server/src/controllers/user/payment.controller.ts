import { inject, injectable } from "inversify";
import { IPaymentController } from "../../core/interfaces/controller/IPaymentController";
import { TYPES } from "../../di/types";
import { IPaymentService } from "../../core/interfaces/service/IPaymentService";
import { Request, RequestHandler, Response } from "express";
import asyncHandler from "express-async-handler";
import { ICourse } from "../../models/Course";
import { use } from "passport";






@injectable()
export class PaymentController implements IPaymentController{
    constructor(@inject(TYPES.PaymentService) private paymentService:IPaymentService){}

    createCheckoutSession = asyncHandler(async(req:Request,res:Response):Promise<void>=>{
         console.log('create checkout payment controller');
         const userId = String(req.user?._id)
        const { courseId, amount, couponCode } = req.body;

        if (!courseId || !amount) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
          }

        const sessionData= await this.paymentService.createCheckoutSession({courseId,amount,couponCode,userId})

        res.status(200).json(sessionData)

    })


    verifyPayment=asyncHandler(async(req:Request,res:Response):Promise<void>=>{
      console.log('payment verify controller');
      
        const {sessionId}=req.query
        const userId = String(req.user?._id)
        const {course}= req.body as {course:ICourse}
        console.log(sessionId,"sessionid from controller");
        console.log(userId,"user id from contreoller");
        
        console.log(course,"couse from controller payment controller");
        
        if (!sessionId || !userId || !course) {
            res.status(400).json({ error: 'Missing required parameters' });
            return;
          }
        
        const paymentDetails= await this.paymentService.verifyAndSavePayment(sessionId as string,userId,course)

        res.status(200).json(paymentDetails)
    
    })


    


}



