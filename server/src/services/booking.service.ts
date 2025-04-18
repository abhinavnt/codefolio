import { inject, injectable } from "inversify";

import { format, isSameDay } from "date-fns";

import mongoose from "mongoose";
import { IBookingService } from "../core/interfaces/service/IBookingServie";
import { TYPES } from "../di/types";
import { IMentorRepository } from "../core/interfaces/repository/IMentorRepository";
import { IBookingRepository } from "../core/interfaces/repository/IBookingRepository";
import { IBooking } from "../models/Booking";






injectable()
export class BookingService implements IBookingService{
   constructor(@inject(TYPES.BookingRepository) private bookingRepository:IBookingRepository,
               @inject(TYPES.MentorRepository) private mentorRepository:IMentorRepository
)
   {}

   async getAvailability(mentorId: string, from: string, to: string): Promise<{ date: string; day: string; timeSlots: { startTime: string; endTime: string; }[]; }[]> {
    const ogMentorId=await this.mentorRepository.findByUsername(mentorId)
    if(!ogMentorId){
        throw new Error("mentor not found")
    }
       const fromDate = new Date(from)
       const toDate= new Date(to)
       return this.mentorRepository.getAvailableSlots(ogMentorId._id as string,fromDate,toDate)
   }


   async createBookingCheckoutSession({ mentorusername, userId, date, startTime, endTime, amount, }: { mentorusername: string; userId: string; date: string; startTime: string; endTime: string; amount: number; }): Promise<{ url: string; sessionId: string; }> {
       const mentor= await this.mentorRepository.findByUsername(mentorusername)
       if (!mentor) throw new Error("Mentor not found")

      const isAvailble=await this.checkSlotAvailability(mentor._id as string,date,startTime,endTime)
      console.log(isAvailble,"isabailble from book service");
      
      if(!isAvailble) throw new Error("Slot is not available")
      
      
      const session = await this.bookingRepository.createBookingCheckoutSession({
         mentorId: String(mentor._id),
         date,
         startTime,
         endTime,
         amount
      })

      console.log(session,"session from service");
      
      return { url: session.url!, sessionId: session.id! }  
      
   }



   async checkSlotAvailability(mentorId: string, date: string, startTime: string, endTime: string): Promise<boolean>{

      const existingBooking= await this.bookingRepository.findBooking(mentorId,date,startTime,endTime)
      console.log(existingBooking,"existing booking from booking sercice");
      
      if (existingBooking) return false

      const mentor=await this.mentorRepository.findByMentorID(mentorId)
      console.log(mentor,"mentor from checkavailbilty");
      
      if (!mentor) return false

      const targetDate = new Date(date)
      const dayOfWeek = format(targetDate, "EEEE")

      const specificDateAvail = mentor.specificDateAvailability.find((avail) => isSameDay(avail.date, targetDate))
      if (specificDateAvail) {
        const slot = specificDateAvail.timeSlots.find(
          (slot) => slot.startTime === startTime && slot.endTime === endTime && !slot.booked
        )
        return !!slot
      }


      const weeklyAvail = mentor.weeklyAvailability.find((avail) => avail.day === dayOfWeek)
      if (weeklyAvail) {
        const slot = weeklyAvail.timeSlots.find(
          (slot) => slot.startTime === startTime && slot.endTime === endTime && !slot.booked
        )
        return !!slot
      }

      return false
      
   }


   async verifyAndSaveBooking(sessionId: string, userId: string): Promise<IBooking> {
      const session = await this.bookingRepository.getBookingPaymentSession(sessionId)
      if (session.payment_status !== "paid") throw new Error("Payment not completed")
         const { mentorId, date, startTime, endTime } = session.metadata!
        console.log(session.metadata,"metadata");
        
          console.log(mentorId,date,startTime,endTime,"verifyAndSaveBooking")
          
      const isAvailable = await this.checkSlotAvailability(mentorId, date, startTime, endTime)
      console.log('verifyAndSaveBooking isAvailble',isAvailable);
      
      if (!isAvailable) throw new Error("Slot is no longer available")
       console.log(userId,"userId from booking service");
       
         const bookingData = {
            mentorId: new mongoose.Types.ObjectId(mentorId),
             userId: new mongoose.Types.ObjectId(userId),
            date: new Date(date),
            startTime,
            endTime,
            paymentStatus: "completed" as "completed",
            totalPrice: session.amount_total! / 100,
          }

          console.log('iam from markslotasBooked');
          
          await this.markSlotAsBooked(mentorId,date,startTime,endTime)

          const booking = await this.bookingRepository.createBooking(bookingData)

          return booking
      
   }


   async markSlotAsBooked(mentorId: string, date: string, startTime: string, endTime: string): Promise<void> {
       const mentor= await this.mentorRepository.findByMentorID(mentorId)
       if (!mentor) throw new Error("Mentor not found")

         const targetDate = new Date(date)
         const dayOfWeek = format(targetDate, "EEEE")

         let specificDateAvail = mentor.specificDateAvailability.find((avail) => isSameDay(avail.date, targetDate))
         if (specificDateAvail) {
           const slot = specificDateAvail.timeSlots.find(
             (slot) => slot.startTime === startTime && slot.endTime === endTime
           )
           if (slot) {
             slot.booked = true
             await mentor.save()
             return
           }
         } else {
           const weeklyAvail = mentor.weeklyAvailability.find((avail) => avail.day === dayOfWeek)
           if (weeklyAvail) {
             const slot = weeklyAvail.timeSlots.find(
               (slot) => slot.startTime === startTime && slot.endTime === endTime
             )
             if (slot) {
               mentor.specificDateAvailability.push({
                 date: targetDate,
                 timeSlots: [{ startTime, endTime, booked: true }],
               })
               await mentor.save()
               return
             }
           }
         }
     
         throw new Error("Slot not found")
   }


   async getMentorBookings(mentorId: string): Promise<any[]> {
    const mentor=await this.mentorRepository.findByUserId(mentorId)
    const bookings = await this.bookingRepository.getBookingsByMentorId(mentor?._id as string);
    return bookings.map((booking) => ({
      id: booking._id,
      studentName: (booking.userId as any).name, 
      studentEmail: (booking.userId as any).email,
      studentImage: (booking.userId as any).image || "/placeholder.svg?height=40&width=40",
      date: booking.date.toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
      time: booking.startTime,
      purpose: "Mentoring session", 
      status: this.determineStatus(booking), 
    }));


    
  }


  private determineStatus(booking: IBooking): "upcoming" | "completed" | "cancelled" {
    const now = new Date();
    const bookingDateTime = new Date(`${booking.date.toDateString()} ${booking.startTime}`);
    if (booking.paymentStatus === "failed") return "cancelled";
    if (bookingDateTime < now && booking.paymentStatus === "completed") return "completed";
    return "upcoming";
  }

  async getUserBookings(userId: string): Promise<IBooking[]> {
      return await this.bookingRepository.getBookingsByUserId(userId)
  }


}