import { AuthRequest } from "../../../types/custom";
import {  Response } from "express"





export interface IMentorReqController{
    addMentorReq(req:AuthRequest,res:Response):Promise<void>
}