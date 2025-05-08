import { IDashboardController } from "../core/interfaces/controller/IDashboardController";
import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IDashboardService } from "../core/interfaces/service/IDashboardService";

@injectable()
export class DashboardController implements IDashboardController {
  constructor(@inject(TYPES.DashboardService) private dashboardService: IDashboardService) {}

  getDashboardData = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const mentorId = req.params.mentorId;
    const dashboardData = await this.dashboardService.getDashboardData(mentorId);
    res.status(200).json(dashboardData);
  });


  getAdminDashboardData=asyncHandler(async(req:Request,res:Response):Promise<void>=>{
    const data = await this.dashboardService.getAdminDashboardData();
    res.status(200).json(data);
  })



}
