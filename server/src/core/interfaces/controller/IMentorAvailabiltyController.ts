import { RequestHandler } from "express";




export interface IMentorAvailabilityController{
    getAvailability:RequestHandler
    addAvailability:RequestHandler
    editAvailability:RequestHandler
    getAllAvailableSlots:RequestHandler
    bookSlot:RequestHandler
}