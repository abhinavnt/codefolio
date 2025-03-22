import { IUserRepository } from "../core/interfaces/repository/IUserRepository";
import { IUser, User } from "../models/User";


export class UserRepository implements IUserRepository{

    async findUserById(userId: string):Promise<IUser| null> {
        return await User.findById(userId)
      }
    
    async updateById(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
      return await User.findByIdAndUpdate(userId, updateData, { new: true });
    }
      
}