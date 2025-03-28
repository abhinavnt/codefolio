import { Request, Response } from "express";
import { IAdminController } from "../../core/interfaces/controller/IAdminController";
import { IMentorRequest } from "../../models/MentorRequest";
import { adminService } from "../../services/admin/admin.service";




const AdminService = new adminService()


export class AdminController implements IAdminController{
  
    //get all mentor requests
    async getMentorApplicationsRequest(req: Request, res: Response): Promise<void> {
        try {
          const page=parseInt(req.query.page as string)||1
          const limit = parseInt(req.query.limit as string) || 10;
         
          const {mentorRequests,total}=await AdminService.getMentorApplicationRequest(page,limit)

          res.status(200).json({mentorApplications:mentorRequests,total,currentPage:page,totalPages:Math.ceil(total/limit)})

        } catch (error) {
            res.status(500).json({ message: "Error when fetching mentor applications" });
        }
    }
  
    //update mentor status
    async updateMentorApplicationStatus(req: Request, res: Response): Promise<void> {
        try {
            const {requestId}=req.params
            const {status}=req.body

            const updatedRequest = await AdminService.updateMentorApplicationStatus(requestId,status)
            res.status(200).json({ mentorApplication: updatedRequest });
        } catch (error) {
            res.status(500).json({ message: "Error updating mentor application status" });
        }
    }


    //get all users
    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const page=parseInt(req.query.page as string)||1
            const limit = parseInt(req.query.limit as string) || 10;
           console.log('user controller');
           
            const {allUsers,total}=await AdminService.getAllUsers(page,limit)
             
            res.status(200).json({UserData:allUsers,total,currentPage:page,totalPages:Math.ceil(total/limit)})
  
          } catch (error) {
              res.status(500).json({ message: "Error when fetching mentor applications" });
          }
    }
    
  
}









