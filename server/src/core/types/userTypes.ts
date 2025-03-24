// import { IAdmin } from "../../models/Admin"
import { IAdmin } from "../../models/Admin"
import { IUser } from "../../models/User"

export interface verifiedUer {
   accessToken:string,
   refreshToken:string,
   user:IUser | IAdmin
}

export interface refreshedUser {
    accessToken:string,
    user: IUser | IAdmin
}