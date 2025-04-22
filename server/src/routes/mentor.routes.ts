import express from "express";
import container from "../di/container";
import { IMentorController } from "../core/interfaces/controller/IMentorController";
import { TYPES } from "../di/types";
import { authMiddleware } from "../middlewares/auth.middleware";
import upload from "../middlewares/upload";
import { UserRole } from "../core/constants/user.enum";



const router = express.Router();


const mentorController=container.get<IMentorController>(TYPES.MentorController)

// router.use(authMiddleware);



router.post('/verify',authMiddleware([UserRole.USER]),mentorController.verifyMentor)

router.put("/profile",authMiddleware([UserRole.USER]),upload.fields([{ name: "profileImage", maxCount: 1 }, { name: "resume", maxCount: 1 }]),mentorController.updateProfile.bind(mentorController))

router.get('/getAvailability',authMiddleware([UserRole.USER]),mentorController.getAvailability)

router.put('/availability',authMiddleware([UserRole.USER]),mentorController.updateAvailability)

router.get('/:username',authMiddleware([UserRole.USER]),mentorController.getMentorProfile)  

export default router