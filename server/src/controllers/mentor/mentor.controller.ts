import { Request, RequestHandler, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { IMentorController } from "../../core/interfaces/controller/IMentorController";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IMentorService } from "../../core/interfaces/service/IMentorService";
import asyncHandler from "express-async-handler";




@injectable()
export class MentorController implements IMentorController{
   constructor(@inject(TYPES.MentorService) private mentorService:IMentorService
){}


    getAllMentors= asyncHandler(async(req:Request,res:Response):Promise<void>=>{
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 8;
        const search = req.query.search as string;
        const rating = req.query.rating ? parseInt(req.query.rating as string) : undefined;
        const technicalSkills = req.query.technicalSkills ? (req.query.technicalSkills as string).split(',') : undefined;
        const priceRange = req.query.priceRange ? (req.query.priceRange as string).split(',').map(Number) as [number, number] : undefined;
        const filters = { rating, technicalSkills, priceRange };

        const {mentors,total}= await this.mentorService.getAllMentors(page,limit,search,filters)

        res.status(200).json({success:true,data:mentors,pagination:{page,limit,total,totalPage:Math.ceil(total/limit)}})
    })

    getMentorProfile=asyncHandler(async(req:Request,res:Response):Promise<void>=>{
     const {username}=req.params
     const mentor= await this.mentorService.getMentorProfile(username)

     if (!mentor) {
        res.status(404).json({ message: 'Mentor not found' });
        return;
      }
      res.status(200).json(mentor);
    })


    verifyMentor= asyncHandler(async(req:Request,res:Response):Promise<void>=>{

      const userId = String(req.user?._id);

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const mentor= await this.mentorService.verifyMentor(userId)

      res.status(200).json({success:true,message:'Mentor verified successfully',data:mentor})

    })

}