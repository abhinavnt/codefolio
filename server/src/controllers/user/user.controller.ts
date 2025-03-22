import { Request, Response } from "express";
import { AuthRequest } from "../../types/custom";
import { userService } from "../../services/user/user.service";
import { IUserController } from "../../core/interfaces/controller/IUserController";
import cloudinary from "../../config/cloudinary";
import { error } from "console";

const UserService = new userService();

export class UserController implements IUserController {

  async getUserProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const user = await UserService.getUserProfile(userId);

      if (user.status === "blocked") {
        res.status(403).json({ message: "you have been blocked" });
        return;
      }

      res.status(200).json({ user });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "an unexpted error occurred please try again" });
    }
  }

  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    console.log('update profile controller');
    
      try {
        const userId=req.user?.id
       console.log('userId from update controlled',userId);
       
        if (!userId) {
          res.status(401).json({ message: "Unauthorized" });
          return;
        }
      
        const { name, title } = req.body;
        console.log(req.body,'req.body');
        
        if (req.file) {

          console.log('before result in update user controll');
          
          const result = cloudinary.uploader.upload_stream({ folder: "profile_image" }, async (error, result) => {
              console.log('after result in update user controll');
              if (error) res.status(500).json({ error: error.message });
              if (result) {
                const updateData = {
                  profileImageUrl: result.secure_url,
                  name,
                  title,
                };
                const response = await UserService.updateUser(userId, updateData);
                res
                  .status(200)
                  .json({ message: "user updated successfully", user: response });
              }
            })
            .end(req.file.buffer);
        }else{

          const updateData = {
            name,
            title,
          };
          const response = await UserService.updateUser(userId, updateData);
          res
            .status(200)
            .json({ message: "user updated successfully", user: response });
        }
        

      } catch (error) {
        console.log(error);
      res.status(500).json({ message: error });
      }
  }
  
}
