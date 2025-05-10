import { Request, response, Response } from "express";
import { AuthService } from "../../services/auth/auth.service";
import { IAuthController } from "../../core/interfaces/controller/IAuthController";
import { Profile } from "passport-google-oauth20";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IAuthService } from "../../core/interfaces/service/IAuthService";
import { VerifiedUserDto } from "../../dtos/response/auth.dto";

// const authService=new AuthService()

@injectable()
export class AuthController implements IAuthController {
  constructor(@inject(TYPES.AuthService) private authService: IAuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("auth register controlleril vannu");

      const { name, email, password } = req.body;
      console.log(name, email, password);

      await this.authService.register(name, email, password);
      console.log("hei registeril ninn resolve ayi");

      res.status(200).json({ message: "otp send to your email" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, otp } = req.body;
      console.log(email, otp);
      const response:VerifiedUserDto = await this.authService.verifyOtp(email, otp);

      const { refreshToken, ...newUser } = response;

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.status(200).json(newUser);
    } catch (error: any) {
      res.status(400).json({ message: error.message, success: false });
      console.log(error);
    }
  };

  resendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      await this.authService.resendOtp(email);

      res.status(200).json({ message: "otp resend to your email" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("yes login request backil ethi");

      const { email, password, role } = req.body;
      console.log(req.body);

      console.log(email, "from controller");

      const { refreshToken, ...user } = await this.authService.login(email, password, role);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(200).json(user);
      console.log("login response poyi");
    } catch (error: any) {
      console.log(error);

      res.status(400).json({ message: error.message });
    }
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("refreshcontrolleril vannitundllo");

      const refreshToken = req.cookies.refreshToken;
      console.log(refreshToken, "refresh token");

      if (!refreshToken) res.status(403).json({ error: "Refresh tokekn required" });
      const { role } = req.body;
      const { accessToken, user } = await this.authService.refreshAccessToken(refreshToken, role);
      res.status(200).json({ accessToken, user });
    } catch (error) {}
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error: any) {
      res.status(500).json({ message: "something went wrong while logging out" });
    }
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      console.log(email, "from forgot password");

      await this.authService.sendMagicLink(email);

      res.status(200).json({ message: "A reset link has been sent to your email" });
    } catch (error: any) {
      if (error.message === "Invalid email address") {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: error.message });
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, newPassword } = req.body;

      await this.authService.resetPassword(token, newPassword);

      res.status(200).json({ message: "password reseted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  handleGoogleUser = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      return res.redirect("http://localhost:5173");
    }

    const googleProfile = req.user as unknown as Profile;

    if (!googleProfile.emails || googleProfile.emails.length === 0) {
      throw new Error("No email provided by Google");
    }

    const response = await this.authService.handleGoogleUser({
      googleId: googleProfile.id,
      email: googleProfile.emails[0].value,
      name: googleProfile.displayName,
      profilepic: googleProfile._json.picture as string,
    });

    const { refreshToken, ...newUser } = response;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    console.log("response povunnu");

    res.redirect("http://localhost:5173/?auth=success");
  };
}
