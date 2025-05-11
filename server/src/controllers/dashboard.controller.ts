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
    const { filterType = "all", filterValue } = req.query;
    const dashboardData = await this.dashboardService.getDashboardData(
      mentorId,
      filterType as string,
      filterValue as string | undefined
    );
    res.status(200).json(dashboardData);
  });

  getAdminDashboardData=asyncHandler(async(req:Request,res:Response):Promise<void>=>{
    const data = await this.dashboardService.getAdminDashboardData();
    res.status(200).json(data);
  })

  getDashboardDataUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = String(req.user?._id);
    const period = req.query.period as "daily" | "weekly" | "monthly" | "yearly" | "all" | undefined;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!period || !["daily", "weekly", "monthly", "yearly", "all"].includes(period)) {
      res.status(400).json({ message: "Invalid or missing period parameter" });
      return;
    }

    const data = await this.dashboardService.getDashboardDataUser(userId, period);
   

    res.status(200).json({ data });
  });


}
