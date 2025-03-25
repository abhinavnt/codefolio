import { IMentorRequest } from "../../../models/MentorRequest";
import { Request, Response } from "express";




export interface IAdminController{
    getMentorApplicationsRequest(req:Request,res:Response):Promise<void>
    updateMentorApplicationStatus(req: Request, res: Response):Promise<void>
}