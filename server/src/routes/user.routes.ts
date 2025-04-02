import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user/user.controller";
import upload from "../middlewares/upload";
import { MentorReqController } from "../controllers/mentor/mentorReq.controller";
import container from "../di/container";
import { IUserController } from "../core/interfaces/controller/IUserController";
import { TYPES } from "../di/types";
import { IMentorReqController } from "../core/interfaces/controller/IMentorReqController";
import { IMentorController } from "../core/interfaces/controller/IMentorController";
import { ICourseController } from "../core/interfaces/controller/ICourseController";
import { Types } from "mongoose";


const router = express.Router();
console.log('user routeil vannu');

const userController =container.get<IUserController>(TYPES.UserController)

const mentorReqController=container.get<IMentorReqController>(TYPES.MentorReqController)

const MentorController=container.get<IMentorController>(TYPES.MentorController)

const courseController=container.get<ICourseController>(TYPES.CourseController)

router.use(authMiddleware);

router.get("/profile",userController.getUserProfile)

router.put('/profile',upload.fields([{name:"profileImage",maxCount:1}]),userController.updateProfile)

router.post('/mentor-request',upload.fields([{ name: "profileImage", maxCount: 1 },{ name: "resume", maxCount: 1 },]),mentorReqController.addMentorReq)

router.get('/getAllCourses',userController.getAllCourse)

router.get('/notifications',userController.getNotifications)

router.post('/change-password',userController.changePassword)

router.get('/getAllMentors',MentorController.getAllMentors)

router.get('/course/:id',courseController.getCourseById)

export default router