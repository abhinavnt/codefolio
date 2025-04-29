import { inject, injectable } from "inversify";
import { IMentorAvailabilityController } from "../core/interfaces/controller/IMentorAvailabiltyController";
import { TYPES } from "../di/types";
import { IMentorAvailabilityService } from "../core/interfaces/service/IMentorAvailabilityService";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";




@injectable()
export class MentorAvailabilityController implements IMentorAvailabilityController{
  constructor(@inject(TYPES.MentorAvailabilityService) private mentorAvailability:IMentorAvailabilityService){}

  getAvailability=asyncHandler(async(req:Request,res:Response):Promise<void>=>{
    const mentorId = req.query.mentorId as string; 
      if (!mentorId) {
        res.status(400).json({ error: "Mentor ID is required" });
        return;
      }
      const availability = await this.mentorAvailability.getMentorAvailability(mentorId);
      res.status(200).json(availability);
  })

  addAvailability=asyncHandler(async(req:Request,res:Response):Promise<void>=>{
    const { mentorId, specificDateAvailability } = req.body;
    if (!mentorId || !specificDateAvailability) {
      res.status(400).json({ error: "Mentor ID and specificDateAvailability are required" });
      return;
    }
    const result = await this.mentorAvailability.addMentorAvailability(mentorId, specificDateAvailability);
    res.status(200).json(result);
  })

  editAvailability=asyncHandler(async(req:Request,res:Response):Promise<void>=>{
    const { id } = req.params;
    const { specificDateAvailability } = req.body;
    if (!id || !specificDateAvailability) {
      res.status(400).json({ error: "ID and specificDateAvailability are required" });
      return;
    }
    const result = await this.mentorAvailability.editMentorAvailability(id, specificDateAvailability);
    res.status(200).json(result);
  })

}