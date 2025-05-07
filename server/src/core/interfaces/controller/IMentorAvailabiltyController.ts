import { RequestHandler } from "express";




export interface IMentorAvailabilityController{
    getAvailability:RequestHandler
    addTimeSlot:RequestHandler
    editTimeSlot:RequestHandler
    deleteTimeSlot:RequestHandler
    getAllAvailableSlots:RequestHandler
    bookSlot:RequestHandler
    getReviews:RequestHandler
    completeReview:RequestHandler
    cancelReview:RequestHandler
    editReview:RequestHandler
    
}