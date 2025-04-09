import Stripe from "stripe";
import { IBookingRepository } from "../core/interfaces/repository/IBookingRepository";
import { Booking, IBooking } from "../models/Booking";
import { Mentor } from "../models/Mentor";
import { startOfDay, endOfDay, getDay } from "date-fns";
import { stripe } from "../config/stripe";
import mongoose from "mongoose";






export class BookingRepository implements IBookingRepository{



  async findBooking(mentorId: string, date: string, startTime: string, endTime: string):Promise<IBooking|null>{
    return await Booking.findOne({mentorId,date: new Date(date),startTime,endTime,paymentStatus: "completed",})
  }

    async getAvailableSlots(mentorId: string, from: Date, to: Date): Promise<{ date: string; day: string; timeSlots: { startTime: string; endTime: string; }[]; }[]> {

        const mentor= await Mentor.findById(mentorId)

        if (!mentor){
            throw new Error("Mentor not found");
        } 

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const result = [];
        let currentDate = startOfDay(from);

        while(currentDate<=endOfDay(to)){
          const dateStr= currentDate.toISOString().split('T')[0]
          const day = days[getDay(currentDate)];


          // Check specific date availability
      const specific = mentor.specificDateAvailability.find(
        (s) => s.date.toISOString().split("T")[0] === dateStr
       );

       let timeSlots = specific? specific.timeSlots.filter((slot) => !slot.booked):mentor.weeklyAvailability.find((w) => w.day === day)?.timeSlots.filter((slot) => !slot.booked) || []


       result.push({
        date:dateStr,
        day,
        timeSlots:timeSlots.map((slot)=>({
            startTime:slot.startTime,
            endTime:slot.endTime,
            isBooked:slot.booked
        }))
       })
       
       currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
        }

        return result;
    }


    // async bookTimeSlot(mentorId: string, date: Date, startTime: string, endTime: string): Promise<void> {

    //     const mentor = await Mentor.findById(mentorId)
    //     if (!mentor) throw new Error("Mentor not found")

    //         const dateStr = date.toISOString().split("T")[0];

    //         let specific = mentor.specificDateAvailability.find(
    //             (s) => s.date.toISOString().split("T")[0] === dateStr
    //           );

    //           if (!specific) {
    //             const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    //             const day = days[getDay(date)];
    //             const weeklySlots = mentor.weeklyAvailability.find((w) => w.day === day)?.timeSlots || [];
    //             specific = {
    //               date,
    //               timeSlots: weeklySlots.map((slot) => ({ ...slot })),
    //             };
    //             mentor.specificDateAvailability.push(specific);
    //           }

    //           const slot = specific.timeSlots.find(
    //             (s) => s.startTime === startTime && s.endTime === endTime
    //           );

    //           if (!slot || slot.booked) throw new Error("Slot unavailable");
    //           slot.booked = true;

    //           await mentor.save();
    // }


    async createBookingCheckoutSession({ mentorId, date, startTime, endTime, amount, }: { mentorId: string; date: string; startTime: string; endTime: string; amount: number; }): Promise<Stripe.Checkout.Session> {
      console.log('createbookin repository',mentorId);
      
        return await stripe.checkout.sessions.create({
          payment_method_types:['card','amazon_pay'],
          line_items:[
            {
              price_data:{
                currency:'inr',
                product_data:{
                  name:'mentor slot booking',
                },
                unit_amount:amount,
              },
              quantity:1
            }
          ],
          mode:"payment",
          success_url:`${process.env.CLIENT_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${process.env.CLIENT_URL}/booking/cancel`,
          metadata:{
            mentorId,
            date,
            startTime,
            endTime
          }
        })
    }


    async getBookingPaymentSession(sessionId: string): Promise<Stripe.Checkout.Session> {
      return await stripe.checkout.sessions.retrieve(sessionId)
    }


    async createBooking(bookingData: Partial<IBooking>): Promise<IBooking> {
        const booking=new Booking(bookingData)
        return await booking.save()
    }



    async getBookingsByMentorId(mentorId: string): Promise<IBooking[]> {
      return Booking.find({ mentorId: new mongoose.Types.ObjectId(mentorId) })
      .populate("userId", "name email image") 
      .exec();
    }



    async getBookingsByUserId(userId: string): Promise<IBooking[]> {
      return await Booking.find({ userId: userId }).populate('mentorId', 'name profileImage specialty');
    }


}



