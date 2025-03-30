import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user/user.controller";
import upload from "../middlewares/upload";
import { MentorReqController } from "../controllers/mentor/mentorReq.controller";
import container from "../di/container";
import { IUserController } from "../core/interfaces/controller/IUserController";
import { TYPES } from "../di/types";
import { IMentorReqController } from "../core/interfaces/controller/IMentorReqController";


const router = express.Router();
console.log('user routeil vannu');

const userController =container.get<IUserController>(TYPES.UserController)

const mentorReqController=container.get<IMentorReqController>(TYPES.MentorReqController)

router.use(authMiddleware);

router.get("/profile",userController.getUserProfile)

router.put('/profile',upload.fields([{name:"profileImage",maxCount:1}]),userController.updateProfile)

router.post('/mentor-request',upload.fields([{ name: "profileImage", maxCount: 1 },{ name: "resume", maxCount: 1 },]),mentorReqController.addMentorReq)

router.get('/getAllCourses',userController.getAllCourse)

router.get('/notifications',userController.getNotifications)

router.post('/change-password',userController.changePassword)

export default router