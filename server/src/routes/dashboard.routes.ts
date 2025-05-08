import express from "express";
import container from "../di/container";
import { IDashboardController } from "../core/interfaces/controller/IDashboardController";
import { TYPES } from "../di/types";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserRole } from "../core/constants/user.enum";



const router = express.Router();

const dashboardController=container.get<IDashboardController>(TYPES.DashboardController)

router.get('/mentor/:mentorId',authMiddleware([UserRole.USER]),dashboardController.getDashboardData)
router.get('/',authMiddleware([UserRole.ADMIN]),dashboardController.getAdminDashboardData)




export default router;