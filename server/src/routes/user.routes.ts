import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user/user.controller";
import upload from "../middlewares/upload";
import { MentorReqController } from "../controllers/mentor/mentorReq.controller";


const router = express.Router();

const userController = new UserController()

const mentorReqController=new MentorReqController()

router.use(authMiddleware);

router.get("/profile",userController.getUserProfile)

router.put('/profile',upload.single("profileImage"),userController.updateProfile)

router.post('/mentor-request',upload.fields([{ name: "profileImage", maxCount: 1 },{ name: "resume", maxCount: 1 },]),mentorReqController.addMentorReq)


export default router