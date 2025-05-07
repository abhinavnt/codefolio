import express from "express";
import container from "../di/container";
import { IMentorAvailabilityController } from "../core/interfaces/controller/IMentorAvailabiltyController";
import { TYPES } from "../di/types";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserRole } from "../core/constants/user.enum";



const router = express.Router();


const mentorAvailabilityController =container.get<IMentorAvailabilityController>(TYPES.MentorAvailabilityController)


router.get('/',authMiddleware([UserRole.USER]),mentorAvailabilityController.getAvailability)
router.post('/add-time-slot',authMiddleware([UserRole.USER]),mentorAvailabilityController.addTimeSlot)
router.post("/edit-time-slot",authMiddleware([UserRole.USER]),mentorAvailabilityController.editTimeSlot)
router.post("/delete-time-slot",authMiddleware([UserRole.USER]),mentorAvailabilityController.deleteTimeSlot)


//admin
router.get('/available-slots',authMiddleware([UserRole.ADMIN]),mentorAvailabilityController.getAllAvailableSlots)
router.post('/book',authMiddleware([UserRole.ADMIN]),mentorAvailabilityController.bookSlot)

//mentor
router.get('/:mentorId/reviews',authMiddleware([UserRole.USER]),mentorAvailabilityController.getReviews)
router.post('/:mentorId/dates/:date/timeSlots/:timeSlotId/complete',authMiddleware([UserRole.USER]),mentorAvailabilityController.completeReview)
router.post('/:mentorId/dates/:date/timeSlots/:timeSlotId/cancel',authMiddleware([UserRole.USER]),mentorAvailabilityController.cancelReview)
router.put('/:mentorId/dates/:date/timeSlots/:timeSlotId/edit',authMiddleware([UserRole.USER]),mentorAvailabilityController.editReview)


export default router