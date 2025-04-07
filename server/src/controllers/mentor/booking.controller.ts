import { inject, injectable } from "inversify";
import { IBookingController } from "../../core/interfaces/controller/IBookingController";
import { TYPES } from "../../di/types";
import { IBookingService } from "../../core/interfaces/service/IBookingServie";
import asyncHandler from "express-async-handler";
import { Request, RequestHandler, Response } from "express";





@injectable()
export class BookingController implements IBookingController{
       constructor(@inject(TYPES.BookingService) private bookinService:IBookingService){}


       getMentorAvailability=asyncHandler(async(req:Request,res:Response):Promise<void>=>{
          const {username}=req.params
          const { from, to } = req.query;
          console.log('username frm book controller',username);
          
          const availability= await this.bookinService.getAvailability(username,from as string,to as string)

          res.status(200).json(availability)
       }) 


       createCheckoutSession=asyncHandler(async(req:Request,res:Response):Promise<void>=>{

         const userId = String(req.user?._id)

         const { mentorusername, date, startTime, endTime } = req.body
         console.log('req body from session creation in booking',req.body);
         
         if (!mentorusername || !date || !startTime || !endTime) {
            res.status(400).json({ error: "Missing required fields" })
            return
          }


          const sessionData = await this.bookinService.createBookingCheckoutSession({
            mentorusername,
            userId,
            date,
            startTime,
            endTime,
            amount: 50000,
          })

          res.status(200).json(sessionData)
       })


       verifyPayment=asyncHandler(async(req:Request,res:Response):Promise<void>=>{

         const { session_id } = req.query
         const userId = String(req.user?._id)
         console.log(userId,"userId from verifypayment booking controller");
         
         if (!session_id) {
           res.status(400).json({ error: "Missing session_id" })
           return
         }

         const booking = await this.bookinService.verifyAndSaveBooking(session_id as string, userId)

         res.status(200).json({ message: "Booking successful", booking })
       })




}