import { IUser } from "../../models/User";
import bcrypt from "bcryptjs";
import { UserRepository } from "../../repositories/user.repository";
import { IUserService } from "../../core/interfaces/service/IUserService";
import { ICourse } from "../../models/Course";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUserRepository } from "../../core/interfaces/repository/IUserRepository";



// const userRepository = new UserRepository();

injectable()
export class userService implements IUserService{
     constructor(@inject(TYPES.UserRepository) private userRepository:IUserRepository
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
        return await this.userRepository.getAllCourses()
    }

    async getNotifications(userId: string): Promise<IUser["notifications"]> {
        console.log('from getnotificatioon service');
        
        return await this.userRepository.getNotification(userId)
    }

    
}