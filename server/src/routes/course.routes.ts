import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ICourseController } from "../core/interfaces/controller/ICourseController";
import container from "../di/container";
import { TYPES } from "../di/types";
import { UserRole } from "../core/constants/user.enum";
import upload from "../middlewares/upload";



const router = express.Router();


const courseController =container.get<ICourseController>(TYPES.CourseController)

// router.use(authMiddleware)

router.get('/enrolled-courses',authMiddleware([UserRole.USER,UserRole.ADMIN]),courseController.getUserEnrolledCourses)
router.get('/course-tasks/:courseId',authMiddleware([UserRole.USER,UserRole.ADMIN]),courseController.getUserCourseTasks)


//admin
router.get('/courses',authMiddleware([UserRole.ADMIN]),courseController.listCoursesAdmin)
router.get('/courses/:id',authMiddleware([UserRole.ADMIN]),courseController.getCourseByIdAdmin)
router.put('/courses/:id',authMiddleware([UserRole.ADMIN]),courseController.updateCourse)
// router.post('/tasks',courseController.)
router.put('/tasks/:id',authMiddleware([UserRole.ADMIN]),courseController.updateTask)
router.delete('/tasks/:id',authMiddleware([UserRole.ADMIN]),courseController.deleteTask)

router.get('/courses/:id/edit', authMiddleware([UserRole.ADMIN]), courseController.getCourseWithTasks);
router.put('/courses/:id', authMiddleware([UserRole.ADMIN]), upload.fields([{ name: 'image', maxCount: 1 }]), courseController.updateCourse);












export default router