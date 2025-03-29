import express  from "express";
import { AdminController } from "../controllers/admin/admin.controller";
import upload from "../middlewares/upload";
import { CourseController } from "../controllers/admin/course.controller";
import container from "../di/container";
import { IAdminController } from "../core/interfaces/controller/IAdminController";
import { TYPES } from "../di/types";
import { ICourseController } from "../core/interfaces/controller/ICourseController";



const router=  express.Router()

const adminController= container.get<IAdminController>(TYPES.AdminController)
const courseController =container.get<ICourseController>(TYPES.CourseController)



router.get('/mentor-application',adminController.getMentorApplicationsRequest)
router.patch('/mentor-applications/:requestId/status',adminController.updateMentorApplicationStatus)

router.post('/addCourse',upload.fields([{name:'image',maxCount:1}]),courseController.addCourse)

router.post('/addCourse',upload.fields([{name:'image',maxCount:1}]),courseController.addCourse)
router.get('/allUsers',adminController.getAllUsers)



export default router;











