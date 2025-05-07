import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ICourseController } from "../core/interfaces/controller/ICourseController";
import container from "../di/container";
import { TYPES } from "../di/types";
import { UserRole } from "../core/constants/user.enum";
import upload from "../middlewares/upload";

const router = express.Router();

const courseController = container.get<ICourseController>(TYPES.CourseController);

// router.use(authMiddleware)

router.get("/enrolled-courses", authMiddleware([UserRole.USER, UserRole.ADMIN]), courseController.getUserEnrolledCourses);

router.get("/course-tasks/:courseId", authMiddleware([UserRole.USER, UserRole.ADMIN]), courseController.getUserCourseTasks);

router.put("/course-tasks/:taskId/complete", authMiddleware([UserRole.USER]), courseController.markTaskAsComplete);

//its not using
router.put("/tasks/:id", authMiddleware([UserRole.ADMIN]), courseController.updateTask);

//admin
router.get("/courses", authMiddleware([UserRole.ADMIN]), courseController.listCoursesAdmin);

router.get("/courses/:id", authMiddleware([UserRole.ADMIN]), courseController.getCourseByIdAdmin);

router.get("/courses/:id/edit", authMiddleware([UserRole.ADMIN]), courseController.getCourseWithTasks);

router.put("/courses/:id", authMiddleware([UserRole.ADMIN]), upload.fields([{ name: "image", maxCount: 1 }]), courseController.updateCourseAdmin);

router.get("/enrolled-courses/admin", authMiddleware([UserRole.ADMIN]), courseController.getAllPurchasedCoursesAdmin);

router.get("/enrolled-courses/:userId/:courseId/tasks", authMiddleware([UserRole.ADMIN]), courseController.getUserTasksAdmin);

router.get("/enrolled-courses/:courseId/:userId/admin", authMiddleware([UserRole.ADMIN]), courseController.findPurchasedCourseById);

export default router;
