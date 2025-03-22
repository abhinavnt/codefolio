import express from "express";
import { AuthController } from "../controllers/auth/auth.controller";

const router = express.Router();

const authController = new AuthController()


router.post("/register",authController.register)
router.post('/login',authController.login)
router.post('/otpverify',authController.verifyOtp)
router.post('/refresh-token',authController.refreshToken)
router.post('/logout',authController.logout)
router.post('/resend-otp',authController.resendOtp)
router.post("/forgot-password", authController.forgotPassword)
router.post("/reset-password",authController.resetPassword)



export default router;