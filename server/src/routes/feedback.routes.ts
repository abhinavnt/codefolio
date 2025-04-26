import express from "express";
import container from "../di/container";
import { IFeedbackController } from "../core/interfaces/controller/IFeedbackController";
import { TYPES } from "../di/types";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserRole } from "../core/constants/user.enum";

const router = express.Router();

const feedbackController = container.get<IFeedbackController>(TYPES.FeedbackController);

router.post("/mentor", authMiddleware([UserRole.USER]), feedbackController.submitMentorFeedback);


router.get("/user-feedbacks", authMiddleware([UserRole.USER]), feedbackController.getUserFeedbacks);

router.get("/:mentorId", authMiddleware([UserRole.USER]), feedbackController.getFeedbackByMentorId);

export default router;
