import { NextFunction, Request, Response } from 'express';
import cloudinary from '../../config/cloudinary';
import { AuthRequest } from '../../types/custom';
import { userService } from '../../services/user/user.service';
import { IUserController } from '../../core/interfaces/controller/IUserController';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../di/types';
import { IUserService } from '../../core/interfaces/service/IUserService';
import asyncHandler from "express-async-handler";
// const UserService = new userService();

injectable()
export class UserController implements IUserController {
   constructor(@inject(TYPES.UserService) private userService:IUserService
  ){}

   getUserProfile = asyncHandler(async(req: Request, res: Response): Promise<void>=> {
  
    const userId = String(req.user?._id)

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const user = await this.userService.getUserProfile(userId);

      if (user.status === 'blocked') {
        res.status(403).json({ message: 'you have been blocked' });
        return;
      }

      res.status(200).json({ user });
  })


  updateProfile=asyncHandler(async(req: Request, res: Response): Promise<void> =>{
    console.log('update profile controller');
   
      const userId = String(req.user?._id)
      console.log('userId from update controlled', userId);

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { name, title } = req.body;
      console.log(req.body, 'req.body');

      if (!name || !title) {
        res.status(400).json({ message: 'Name and title are required' });
        return;
      }

      const updateData: { profileImageUrl?: string; name: string; title: string } = {
        name,
        title,
      };

      console.log(req.file,"req file from front end");
      
     if (req.files && (req.files as { [fieldname: string]: Express.Multer.File[] }).profileImage) {
             const files = req.files as { [fieldname: string]: Express.Multer.File[] }; // Explicitly define type
     
             console.log('Uploading profile image to Cloudinary...');
     
             await new Promise((resolve, reject) => {
               cloudinary.uploader.upload_stream({ folder: 'mentor_profiles' }, (error, result) => {
                 if (error) {
                   console.error('Cloudinary upload error (profile image):', error);
                   reject(error);
                   return;
                 }
                 if (result) {
                   updateData.profileImageUrl = result.secure_url;
                   resolve(result);
                 }
               }).end(files.profileImage[0].buffer);
             });
           }

      const response = await this.userService.updateUser(userId, updateData);
      res.status(200).json({ message: 'User updated successfully', user: response });
  })


 getAllCourse=asyncHandler( async(req: Request, res: Response): Promise<void> =>{
    console.log('hai from getAllcourses');
    
      const courses= await this.userService.getAllCourse()

      res.status(200).json(courses)
  })

  getNotifications=asyncHandler(async(req:Request,res:Response):Promise<void>=>{
    const userId = String(req.user?._id)
    console.log('log from getnotification controller');
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
   
    const notifications = await this.userService.getNotifications(userId)

    res.status(200).json({notifications})
   
  }
)

}