import { Request, RequestHandler, Response } from "express";







export interface IBookingController{
    getMentorAvailability:RequestHandler
    createCheckoutSession:RequestHandler
    verifyPayment:RequestHandler
    getMentorBookings:RequestHandler
    getUserBookings :RequestHandler
    cancelBooking:RequestHandler
    completeBooking:RequestHandler
    editFeedback:RequestHandler
}