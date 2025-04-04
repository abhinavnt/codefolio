import express from "express";
import container from "../di/container";
import { IMentorController } from "../core/interfaces/controller/IMentorController";
import { TYPES } from "../di/types";
import { authMiddleware } from "../middlewares/auth.middleware";
import upload from "../middlewares/upload";



const router = express.Router();


const mentorController=container.get<IMentorController>(TYPES.MentorController)

router.use(authMiddleware);

router.get('/:username',mentorController.getMentorProfile)

router.post('/verify',mentorController.verifyMentor)

router.put("/profile",upload.fields([{ name: "profileImage", maxCount: 1 }, { name: "resume", maxCount: 1 }]),mentorController.updateProfile.bind(mentorController))





export default router