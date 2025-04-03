import express from "express";
import container from "../di/container";
import { IMentorController } from "../core/interfaces/controller/IMentorController";
import { TYPES } from "../di/types";
import { authMiddleware } from "../middlewares/auth.middleware";



const router = express.Router();


const mentorController=container.get<IMentorController>(TYPES.MentorController)

router.use(authMiddleware);

router.get('/:username',mentorController.getMentorProfile)





export default router