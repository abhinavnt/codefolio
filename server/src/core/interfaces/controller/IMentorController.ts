
import {  RequestHandler, Response } from "express"





export interface IMentorController{
    getAllMentors:RequestHandler
    getMentorProfile:RequestHandler
    verifyMentor:RequestHandler
    updateProfile:RequestHandler
    updateAvailability:RequestHandler
    getAvailability:RequestHandler
 
}