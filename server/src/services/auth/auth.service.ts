import bcrypt from 'bcryptjs'
import jwt   from 'jsonwebtoken'
import dotenv from 'dotenv'
import { AuthRepository } from '../../repositories/auth.repository'
import { IUser } from '../../models/User'
import { IAuthRepository } from '../../core/interfaces/repository/IAuthRepository'
import { refreshedUser, verifiedUer } from "../../core/types/userTypes";
import { RedisClient } from '../../config/redis'
import { IAuthService } from '../../core/interfaces/service/IAuthService'
import { sendForgotPasswordMail, sendOtpEmail } from '../../utils/email.services'
import { IAdmin } from '../../models/Admin'
import { verifyResetToken } from '../../utils/token.services'

dotenv.config()

const authRepository=new AuthRepository()

export class AuthService implements IAuthService{

    async register(name: string, email: string, password: string): Promise<void> {
        console.log(name);
        
        const existingUser=await authRepository.findUserByEmail(email)
        
        if(existingUser) throw new Error("Email is alredy taken")
        
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            
            const hashedPassword = await bcrypt.hash(password, 10);

             await sendOtpEmail(email,otp)
           
             
             await RedisClient.setex(`otp:${email}`, 150, JSON.stringify({ otp }))

             await RedisClient.setex(
                `user_session:${email}`,
                600,
                JSON.stringify({ name, email, hashedPassword })
              );

    }


    async verifyOtp(email: string, otp: string): Promise<verifiedUer> {
        const data=await RedisClient.get(`otp:${email}`)
        if(!data) throw new Error("OTP expired or invalid");

        const { otp: storedOtp } = JSON.parse(data);
        if (otp !== storedOtp) throw new Error("Invalid OTP");

        const userData = await RedisClient.get(`user_session:${email}`);
        if (!userData) throw new Error("User data not found Please register again");
        console.log(userData,'from redis');
        
        const { name, hashedPassword } = JSON.parse(userData);

        const user = await authRepository.createUser(name, email, hashedPassword);

        if (!user) throw new Error("Cannot create user please register again");

        const userId = user._id;
        console.log('before access toke');
        console.log(process.env.ACCESS_TOKEN_SECRET,'secret key from env');
        
        const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {expiresIn: "15m",});
        console.log('after access toke');
        const refreshToken = jwt.sign({ userId },process.env.REFRESH_TOKEN_SECRET!,{expiresIn: "7d",});

        await RedisClient.del(`otp:${email}`);
        await RedisClient.del(`user_session:${email}`);

        return { accessToken, refreshToken, user };
    }

    async resendOtp(email: string): Promise<void> {
      try {
        const user = await RedisClient.get(`user_session:${email}`);
        if (!user) throw new Error("user session expired please register again");
  
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
        await sendOtpEmail(email, otp);
  
        await RedisClient.setex(`otp:${email}`, 120, JSON.stringify({ otp }));
      } catch (error: any) {
        console.error(error);
        throw new Error(`error while resending otp:${error}`);
      }
    }

    async login(email: string,password: string,role: string): Promise<verifiedUer> {
         
        console.log('login servicel kayri');
        
        let user: IAdmin | IUser | null;
         console.log('email',email);
         
        if (role === "admin") user = await authRepository.findAdminByEmail(email);
        else user = await authRepository.findUserByEmail(email);

        console.log('login servicel kayri 1',role,user);
        
        if (!user) throw new Error("Invalid email address");
        console.log('login servicel kayri 2');
        if ("status" in user && user.status === "blocked") {
          throw new Error("you have been blocked");
        }
        console.log('login servicel kayri 3');
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) throw new Error("Incorrect password");
        console.log('login servicel kayri 4');
        const userId = user._id;
        const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
          expiresIn: "15m",
        });
        const refreshToken = jwt.sign(
          { userId },
          process.env.REFRESH_TOKEN_SECRET!,
          {
            expiresIn:"7d",
          }
        );

        console.log('hei last und login servicesl');
        
        return { accessToken, refreshToken, user: user as IUser};
      }


    async refreshAccessToken(refreshToken: string, role: string): Promise<refreshedUser> {
        try {
            const decoded= jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET!)as { userId: string }

            const userId = decoded.userId;

            const newAccessToken=jwt.sign({userId},process.env.ACCESS_TOKEN_SECRET!,{expiresIn: "15m"})

            let user
            if(role==='admin'){
                console.log('admin here');
            }else{
                user = await authRepository.findUserById(decoded.userId)
            }

            if (!user) {
                throw new Error("cannot find user please try again");
              }
              return { accessToken: newAccessToken, user };

        } catch (error) {
            throw new Error("Invalid refresh token");
        }
    }

    async sendMagicLink(email: string): Promise<void> {

      try {
        console.log('log from sendMagicLink');
        
        const user= await authRepository.findUserByEmail(email)
        
        console.log('user from sendmagic link',user);
        

        if(!user) throw new Error("Invalid email address")

        const token = jwt.sign({ userId: user._id, email, purpose: "reset-password" },process.env.ACCESS_TOKEN_SECRET!,{ expiresIn: "15m" });

        const magicLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

        await sendForgotPasswordMail(email, magicLink);

        await RedisClient.setex(`magicLink:${email}`,900,JSON.stringify({ magicLink }));

      } catch (error:any) {
        throw new Error(error.message);
      }

    }


    async resetPassword(token: string, newPassword: string): Promise<void> {
        try {
          const { userId, email, purpose } = await verifyResetToken(token,"reset-password");

          if (!userId || purpose !== "reset-password") {
            throw new Error("Invalid token");
          }

          const hashedPassword = await bcrypt.hash(newPassword, 10);

          await authRepository.updateUserPassword(userId, hashedPassword);

          await RedisClient.del(`magicLink:${email}`);


        } catch (error:any) {
          throw new Error(error.message);
        }
    }


}
