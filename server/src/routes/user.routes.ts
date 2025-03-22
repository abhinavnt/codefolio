import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user/user.controller";
import upload from "../middlewares/upload";


const router = express.Router();

const userController = new UserController()

router.use(authMiddleware);

router.get("/profile",userController.getUserProfile)

router.put('/profile',upload.single("profileImage"),userController.updateProfile)


export default router