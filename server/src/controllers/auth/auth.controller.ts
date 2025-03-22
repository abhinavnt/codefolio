import { Request, response, Response } from "express";
import { AuthService } from "../../services/auth/auth.service";
import { IAuthController } from "../../core/interfaces/controller/IAuthController";

const authService=new AuthService()


export class AuthController implements IAuthController{

    async register(req: Request, res: Response): Promise<void> {
        try {
            const {name,email,password}=req.body;
            console.log(name,email,password);
            
            await authService.register(name,email,password)
            console.log('hei registeril ninn resolve ayi');
            
            res.status(200).json({ message: "otp send to your email" });
        } catch (error:any) {
            res.status(400).json({ message: error.message });
        }
    }


    async verifyOtp(req: Request, res: Response): Promise<void> {
        try {
            const {email,otp}=req.body
            console.log(email,otp);
            const response=await authService.verifyOtp(email,otp)

            const {refreshToken,...newUser} =response
            
            res.cookie("refreshToken",refreshToken,{httpOnly:true,secure:process.env.NODE_ENV=== "production", sameSite: "strict"})
            res.status(200).json(newUser);
            
        } catch (error:any) {
            res.status(400).json({ message: error.message, success:false });
      console.log(error)
        }
    }

    async resendOtp(req: Request, res: Response): Promise<void> {
        try {
            const {email}= req.body

            await authService.resendOtp(email)

            res.status(200).json({message:'otp resend to your email'})
        } catch (error:any) {
            res.status(400).json({error:error.message})
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {

            console.log('yes login request backil ethi');
            
            const {email,password,role}= req.body

            console.log(email,'from controller');
            
            const {refreshToken,...user}= await authService.login(email,password,role)

           res.cookie('refreshToken',refreshToken,{httpOnly:true,secure:process.env.NODE_ENV === "production",sameSite:"strict"})

           res.status(200).json(user)
           console.log('login response poyi');
           
        } catch (error) {
            
        }
    }

    
   async refreshToken(req: Request, res: Response): Promise<void> {
        try {
            const refreshToken = req.cookies.refreshToken
            if (!refreshToken) res.status(403).json({ error: "Refresh tokekn required" });
            const {role}=req.body
            const { accessToken, user } = await authService.refreshAccessToken(refreshToken,role);
          res.status(200).json({ accessToken, user });
        } catch (error) {
            
        }
    }

   async logout(req: Request, res: Response): Promise<void> {
        try {
            res.clearCookie('refreshToken',{
                httpOnly:true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
            })
            res.status(200).json({message : 'Logged out successfully'})
        } catch (error:any) {
            res.status(500).json({message : 'something went wrong while logging out'})
        }
    }

    
    async forgotPassword(req: Request, res: Response): Promise<void> {
        try {
            const {email}=req.body
            console.log(email,'from forgot password');
            
            await authService.sendMagicLink(email)

            res.status(200).json({message: 'A reset link has been sent to your email',});


        } catch (error:any) {

            if (error.message === 'Invalid email address') {
            res.status(404).json({ message: error.message });
            return
             }
            res.status(500).json({ message: error.message });
    }
        
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const {token,newPassword}=req.body
            
            await authService.resetPassword(token,newPassword)

            res.status(200).json({ message: "password reseted successfully" });

        } catch (error:any) {
            res.status(500).json({ message: error.message });
        }
    }


}