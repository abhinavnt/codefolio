import express  from "express";
import { AdminController } from "../controllers/admin/admin.controller";
import upload from "../middlewares/upload";
import { CourseController } from "../controllers/admin/course.controller";



const router=  express.Router()

const adminController=new AdminController()
const courseController = new CourseController()



router.get('/mentor-application',adminController.getMentorApplicationsRequest)
router.patch('/mentor-applications/:requestId/status',adminController.updateMentorApplicationStatus)

router.post('/addCourse',upload.fields([{name:'image',maxCount:1}]),courseController.addCourse)



export default router;











