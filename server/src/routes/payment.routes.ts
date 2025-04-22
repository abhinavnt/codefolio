import express from "express";
import container from "../di/container";
import { IPaymentController } from "../core/interfaces/controller/IPaymentController";
import { TYPES } from "../di/types";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserRole } from "../core/constants/user.enum";

const router = express.Router();



const paymentController= container.get<IPaymentController>(TYPES.PaymentController)

// router.use(authMiddleware)

router.post('/create-checkout-session',authMiddleware([UserRole.USER]),paymentController.createCheckoutSession)
router.post('/verify-payment',authMiddleware([UserRole.USER]),paymentController.verifyPayment)




export default router