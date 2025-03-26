import { IAuthRepository } from "../core/interfaces/repository/IAuthRepository";
import { Admin, IAdmin } from "../models/Admin";
// import { Admin, IAdmin } from "../models/Admin";
import { IUser, User } from "../models/User";

export class AuthRepository implements IAuthRepository {
  async findUserByEmail(email: string):Promise<IUser|null> {
    return User.findOne({ email });
  }

  async findAdminByEmail(email:string):Promise<IAdmin|null>{
    return Admin.findOne({email})
  }

  async createUser(name: string, email: string, hashedPassword: string):Promise<IUser|null> {
    return User.create({ name, email, password: hashedPassword });
  }

  async findUserById(id:string):Promise<IUser|null>{
    return User.findOne({ _id: id, status: 'active' })
  }

  async findAdminById(id:string):Promise<IAdmin|null>{
    return Admin.findById(id)
  }

  async updateUserPassword(id:string, password:string):Promise<IUser|null>{
    return User.findByIdAndUpdate(id,{password}, {new:true})
  }

  async createGoogleUser(googleId: string, name: string, password: string, email: string, profileImageUrl: string): Promise<IUser | null> {
       return await User.create({googleId,name,password,email,profileImageUrl})
  }
  
  
}