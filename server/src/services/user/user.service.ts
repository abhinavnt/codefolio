import { IUser } from "../../models/User";
import bcrypt from "bcryptjs";
import { UserRepository } from "../../repositories/user.repository";
import { IUserService } from "../../core/interfaces/service/IUserService";



const userRepository = new UserRepository();


export class userService implements IUserService{

    async getUserProfile(userId: string): Promise<IUser> {
        try {
            const user=await userRepository.findUserById(userId)
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
            
            const user=await userRepository.updateById(userId,updateData)
            console.log(user);
            
            if (!user) {
                throw new Error("cannot update user. please try again");
              }
              return user
        } catch (error) {
            throw new Error("error while updating user");
        }
    }

    
}