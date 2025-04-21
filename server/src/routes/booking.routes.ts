import express from "express";
import container from "../di/container";
import { IBookingController } from "../core/interfaces/controller/IBookingController";
import { TYPES } from "../di/types";
import { authMiddleware } from "../middlewares/auth.middleware";


const router = express.Router();


const bookingController=container.get<IBookingController>(TYPES.BookingController)


router.use(authMiddleware)
router.get("/:username/availability",bookingController.getMentorAvailability)
router.post('/create-checkout-session',bookingController.createCheckoutSession)
router.get('/verify-payment',bookingController.verifyPayment)
router.get('/bookings',bookingController.getMentorBookings)
router.get('/user-bookings',bookingController.getUserBookings)

router.patch("/bookings/:bookingId/cancel", bookingController.cancelBooking);
router.patch("/bookings/:bookingId/complete", bookingController.completeBooking);
router.patch("/bookings/:bookingId/feedback", bookingController.editFeedback)

export default router