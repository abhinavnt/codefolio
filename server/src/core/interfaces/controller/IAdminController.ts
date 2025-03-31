import { IMentorRequest } from "../../../models/MentorRequest";
import { Request, RequestHandler, Response } from "express";




export interface IAdminController{
    getMentorApplicationsRequest:RequestHandler
    updateMentorApplicationStatus:RequestHandler
    getAllUsers:RequestHandler
    toggleUserStatus:RequestHandler
    getAllMentors:RequestHandler
    toggleMentorStatus:RequestHandler
}