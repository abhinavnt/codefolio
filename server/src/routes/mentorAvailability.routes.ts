import express from "express";
import container from "../di/container";
import { IMentorAvailabilityController } from "../core/interfaces/controller/IMentorAvailabiltyController";
import { TYPES } from "../di/types";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserRole } from "../core/constants/user.enum";



const router = express.Router();


const mentorAvailabilityController =container.get<IMentorAvailabilityController>(TYPES.MentorAvailabilityController)


router.get('/',authMiddleware([UserRole.USER]),mentorAvailabilityController.getAvailability)
router.post('/',authMiddleware([UserRole.USER]),mentorAvailabilityController.addAvailability)
router.put("/:id",authMiddleware([UserRole.USER]),mentorAvailabilityController.editAvailability)


export default router