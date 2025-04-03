
import {  RequestHandler, Response } from "express"





export interface IMentorController{
    getAllMentors:RequestHandler
    getMentorProfile:RequestHandler
}