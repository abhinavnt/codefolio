import express from "express";
import container from "../di/container";
import { IPaymentController } from "../core/interfaces/controller/IPaymentController";
import { TYPES } from "../di/types";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();



const paymentController= container.get<IPaymentController>(TYPES.PaymentController)

router.use(authMiddleware)

router.post('/create-checkout-session',paymentController.createCheckoutSession)
router.post('/verify-payment',paymentController.verifyPayment)




export default router