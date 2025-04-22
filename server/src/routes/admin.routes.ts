import express  from "express";
import { AdminController } from "../controllers/admin/admin.controller";
import upload from "../middlewares/upload";
import { CourseController } from "../controllers/admin/course.controller";
import container from "../di/container";
import { IAdminController } from "../core/interfaces/controller/IAdminController";
import { TYPES } from "../di/types";
import { ICourseController } from "../core/interfaces/controller/ICourseController";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserRole } from "../core/constants/user.enum";



const router=  express.Router()

const adminController= container.get<IAdminController>(TYPES.AdminController)
const courseController =container.get<ICourseController>(TYPES.CourseController)



router.get('/mentor-application',authMiddleware([UserRole.ADMIN]),adminController.getMentorApplicationsRequest)
router.patch('/mentor-applications/:requestId/status',authMiddleware([UserRole.ADMIN]),adminController.updateMentorApplicationStatus)
router.post('/addCourse',authMiddleware([UserRole.ADMIN]),upload.fields([{name:'image',maxCount:1}]),courseController.addCourse)
router.get('/allUsers',authMiddleware([UserRole.ADMIN]),adminController.getAllUsers)
router.patch('/user/:id/status',authMiddleware([UserRole.ADMIN]),adminController.toggleUserStatus)
router.get('/allMentors',authMiddleware([UserRole.ADMIN]),adminController.getAllMentors)
router.patch('/mentor/:id/status',authMiddleware([UserRole.ADMIN]),adminController.toggleMentorStatus)

export default router;











