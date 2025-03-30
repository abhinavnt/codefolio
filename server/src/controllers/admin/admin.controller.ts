import { Request, Response } from "express";
import { IAdminController } from "../../core/interfaces/controller/IAdminController";
import { IMentorRequest } from "../../models/MentorRequest";
import { adminService } from "../../services/admin/admin.service";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IAdminService } from "../../core/interfaces/service/IAdminService";
import asyncHandler from "express-async-handler";
import { use } from "passport";



// const AdminService = new adminService()

@injectable()
export class AdminController implements IAdminController{
  constructor(@inject(TYPES.AdminService) private adminService:IAdminService){}
    //get all mentor requests
    getMentorApplicationsRequest=asyncHandler(async(req: Request, res: Response): Promise<void>=> {
        
          const page=parseInt(req.query.page as string)||1
          const limit = parseInt(req.query.limit as string) || 10;
         
          const {mentorRequests,total}=await this.adminService.getMentorApplicationRequest(page,limit)

          res.status(200).json({mentorApplications:mentorRequests,total,currentPage:page,totalPages:Math.ceil(total/limit)})

       
    })
  
    //update mentor status
     updateMentorApplicationStatus=asyncHandler(async(req: Request, res: Response): Promise<void>=> {
    
            const {requestId}=req.params
            const {status,message}=req.body
            console.log(message,"message from frontend");
            

            const updatedRequest = await this.adminService.updateMentorApplicationStatus(requestId,status,message)
            res.status(200).json({ mentorApplication: updatedRequest });
       
    })


    //get all users
    getAllUsers= asyncHandler(async(req: Request, res: Response): Promise<void> =>{
        
            const page=parseInt(req.query.page as string)||1
            const limit = parseInt(req.query.limit as string) || 10;
           console.log('user controller');
           
            const {allUsers,total}=await this.adminService.getAllUsers(page,limit)
             
            res.status(200).json({UserData:allUsers,total,currentPage:page,totalPages:Math.ceil(total/limit)})
  
         
    })


    //toggle user status
    toggleUserStatus=asyncHandler(async(req:Request,res:Response):Promise<void>=>{
        const {id}=req.params
        const user=await this.adminService.toggleUserStatus(id)
        res.status(200).json({ message: "user status changed successfully" })
    })
    
  
}









