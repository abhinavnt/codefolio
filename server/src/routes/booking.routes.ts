import express from "express";
import container from "../di/container";
import { IBookingController } from "../core/interfaces/controller/IBookingController";
import { TYPES } from "../di/types";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserRole } from "../core/constants/user.enum";

const router = express.Router();

const bookingController = container.get<IBookingController>(TYPES.BookingController);

// router.use(authMiddleware)
router.get("/:username/availability", authMiddleware([UserRole.USER]), bookingController.getMentorAvailability);

router.post("/create-checkout-session", authMiddleware([UserRole.USER]), bookingController.createCheckoutSession);

router.get("/verify-payment", authMiddleware([UserRole.USER]), bookingController.verifyPayment);

router.get("/bookings", authMiddleware([UserRole.USER]), bookingController.getMentorBookings);

router.get("/user-bookings", authMiddleware([UserRole.USER]), bookingController.getUserBookings);

router.patch("/bookings/:bookingId/cancel", authMiddleware([UserRole.USER]), bookingController.cancelBooking);

router.patch("/bookings/:bookingId/complete", authMiddleware([UserRole.USER]), bookingController.completeBooking);

router.patch("/bookings/:bookingId/feedback", authMiddleware([UserRole.USER]), bookingController.editFeedback);

export default router;
