import { Request, Response } from 'express';
import cloudinary from '../../config/cloudinary';
import { AuthRequest } from '../../types/custom';
import { userService } from '../../services/user/user.service';
import { IUserController } from '../../core/interfaces/controller/IUserController';

const UserService = new userService();

export class UserController implements IUserController {
  // Helper method
  // private async uploadToCloudinary(
  //   buffer: Buffer,
  //   folder: string
  // ): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     cloudinary.uploader.upload_stream({ folder }, (error, result) => {
  //       if (error) {
  //         console.error(`Cloudinary upload error (${folder}):`, error);
  //         reject(error);
  //         return;
  //       }
  //       if (result) {
  //         resolve(result.secure_url);
  //       } else {
  //         reject(new Error(`Cloudinary upload failed: No result returned for ${folder}`));
  //       }
  //     }).end(buffer);
  //   });
  // }

  async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as AuthRequest).user?.id;

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const user = await UserService.getUserProfile(userId);

      if (user.status === 'blocked') {
        res.status(403).json({ message: 'you have been blocked' });
        return;
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      res
        .status(500)
        .json({ message: 'An unexpected error occurred, please try again' });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    console.log('update profile controller');
    try {
      const userId = (req as AuthRequest).user?.id;
      console.log('userId from update controlled', userId);

      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const { name, title } = req.body;
      console.log(req.body, 'req.body');

      // Validate required fields (optional, depending on your requirements)
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

      const response = await UserService.updateUser(userId, updateData);
      res.status(200).json({ message: 'User updated successfully', user: response });
    } catch (error) {
      console.error('Error in updateProfile:', error);
      res
        .status(500)
        .json({ message: 'An unexpected error occurred, please try again' });
    }
  }


  async getAllCourse(req: Request, res: Response): Promise<void> {
    console.log('hai from getAllcourses');
    
      const courses= await UserService.getAllCourse()

      res.status(200).json(courses)
  }

}