import express  from "express";
import { AdminController } from "../controllers/admin/admin.controller";



const router=  express.Router()

const adminController=new AdminController()



router.get('/mentor-application',adminController.getMentorApplicationsRequest)
router.patch('/mentor-applications/:requestId/status',adminController.updateMentorApplicationStatus)



export default router;











