

// const userRepository = new UserRepository();

import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IUserRepository } from "../core/interfaces/repository/IUserRepository";
import { IUserService } from "../core/interfaces/service/IUserService";
import { IUser } from "../models/User";
import { ICourse } from "../models/Course";
import bcrypt from "bcryptjs";
import { ICourseRepository } from "../core/interfaces/repository/ICourseRepository";

injectable()
export class userService implements IUserService{
     constructor(@inject(TYPES.UserRepository) private userRepository:IUserRepository,
                  @inject(TYPES.CourseRepository) private courseRepository:ICourseRepository
    ){}
    async getUserProfile(userId: string): Promise<IUser> {
        try {
            const user=await this.userRepository.findUserById(userId)
            if(!user){
                throw new Error("invalid userId")
            }

            return user
        } catch (error) {
            throw new Error("error while fetching user");
        }
    }

   
    async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser> {
        try {
            console.log('update service here');
            
            const user=await this.userRepository.updateById(userId,updateData)
            console.log(user);
            
            if (!user) {
                throw new Error("cannot update user. please try again");
              }
              return user
        } catch (error) {
            throw new Error("error while updating user");
        }
    }


    async getAllCourse(): Promise<ICourse[] | null> {
        return await this.courseRepository.getAllCourses()
    }

    async getNotifications(userId: string): Promise<IUser["notifications"]> {
        console.log('from getnotificatioon service');
        
        return await this.userRepository.getNotification(userId)
    }

    async changePassword(userId: string, oldPass: string, newPass: string): Promise<Boolean | null> {
        try {
            console.log('user serviceil kayritundd');
            
            const user= await this.userRepository.findUserById(userId)
            if(!user){
                throw new Error("user not found")
            }

           const isPasswordMatch = await bcrypt.compare(oldPass,user.password)

            console.log(isPasswordMatch,'ispasswordMatch');
            
           if(!isPasswordMatch){
               throw new Error("password not matching")
           }

           const hashedPassword=await bcrypt.hash(newPass,10)

           const passwrdChanged=await this.userRepository.changePassword(user.id,hashedPassword)

           console.log(passwrdChanged,"password changed from service");
           
           return passwrdChanged

        } catch (error:any) {
            console.log(error);
            
            throw new Error(error)
        }
    }
}