import express from "express";
import { AuthController } from "../controllers/auth/auth.controller";
import passport from "passport";
import dotenv from "dotenv";
import container from "../di/container";
import { IAuthController } from "../core/interfaces/controller/IAuthController";
import { TYPES } from "../di/types";
dotenv.config();
const router = express.Router();

const authController = container.get<IAuthController>(TYPES.AuthController);

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/otpverify", authController.verifyOtp);

router.post("/refresh-token", authController.refreshToken);

router.post("/logout", authController.logout);

router.post("/resend-otp", authController.resendOtp);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", authController.resetPassword);

router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: process.env.CLIENT_URL, session: false }),
  authController.handleGoogleUser
);

export default router;
