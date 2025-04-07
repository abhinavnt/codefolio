import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ICourseController } from "../core/interfaces/controller/ICourseController";
import container from "../di/container";
import { TYPES } from "../di/types";



const router = express.Router();


const courseController =container.get<ICourseController>(TYPES.CourseController)

router.use(authMiddleware)

router.get('/enrolled-courses',courseController.getUserEnrolledCourses)
router.get('/course-tasks/:courseId',courseController.getUserCourseTasks)












export default router