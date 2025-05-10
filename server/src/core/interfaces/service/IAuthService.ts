import { VerifiedUserDto } from "../../../dtos/response/auth.dto"
import { IUser } from "../../../models/User"
import { refreshedUser, verifiedUer } from "../../types/userTypes"

export interface IAuthService {
    register(name: string, email: string, password: string):Promise<void> 
    verifyOtp(email: string, otp: string):Promise<VerifiedUserDto>
    resendOtp(email: string):Promise<void>
    login(email: string, password: string, role: string):Promise<verifiedUer>
    refreshAccessToken(refreshToken: string, role: string):Promise<refreshedUser>
    sendMagicLink(email: string):Promise<void>
    resetPassword(token: string, newPassword: string):Promise<void>
    handleGoogleUser(googleData: {googleId: string;email: string;name: string;profilepic: string;}): Promise<verifiedUer>;
}