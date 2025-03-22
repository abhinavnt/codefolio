// import { IAdmin } from "../../../models/Admin";
import { IUser } from "../../../models/User";

export interface IAuthRepository {
    findUserByEmail(email: string):Promise<IUser|null>
    // findAdminByEmail(email:string):Promise<IAdmin|null>
    createUser(name: string, email: string, hashedPassword: string):Promise<IUser|null>
    findUserById(id:string):Promise<IUser|null>
    // findAdminById(id:string):Promise<IAdmin|null>
    updateUserPassword(id:string, password:string):Promise<IUser|null>
}