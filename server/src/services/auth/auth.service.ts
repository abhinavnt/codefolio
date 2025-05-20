import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthRepository } from "../../repositories/auth.repository";
import { IUser } from "../../models/User";
import { IAuthRepository } from "../../core/interfaces/repository/IAuthRepository";
import { refreshedUser, verifiedUer } from "../../core/types/userTypes";
import { RedisClient } from "../../config/redis";
import { IAuthService } from "../../core/interfaces/service/IAuthService";
import { sendForgotPasswordMail, sendOtpEmail } from "../../utils/email.services";
import { IAdmin } from "../../models/Admin";
import { verifyResetToken } from "../../utils/token.services";
import { UserRepository } from "../../repositories/user.repository";
import { inject, injectable } from "inversify";
import { TYPES } from "../../di/types";
import { IUserRepository } from "../../core/interfaces/repository/IUserRepository";
import { UserRole } from "../../core/constants/user.enum";
import { UserDto, VerifiedUserDto } from "../../dtos/response/auth.dto";

dotenv.config();

// const authRepository=new AuthRepository()
// const userRepository=new UserRepository()

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.AuthRepository) private authRepository: IAuthRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async register(name: string, email: string, password: string): Promise<void> {
    console.log(name);
    console.log("register servicil vannuu iam here for help you");
    try {
      const existingUser = await this.authRepository.findUserByEmail(email);

      if (existingUser) throw new Error("Email is alredy taken");

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const hashedPassword = await bcrypt.hash(password, 10);

      await sendOtpEmail(email, otp);

      await RedisClient.setex(`otp:${email}`, 150, JSON.stringify({ otp }));

      await RedisClient.setex(`user_session:${email}`, 600, JSON.stringify({ name, email, hashedPassword }));
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async verifyOtp(email: string, otp: string): Promise<VerifiedUserDto> {
    try {
      const data = await RedisClient.get(`otp:${email}`);
      if (!data) throw new Error("OTP expired or invalid");

      const { otp: storedOtp } = JSON.parse(data);
      if (otp !== storedOtp) throw new Error("Invalid OTP");

      const userData = await RedisClient.get(`user_session:${email}`);
      if (!userData) throw new Error("User data not found Please register again");
      console.log(userData, "from redis");

      const { name, hashedPassword } = JSON.parse(userData);

      const user = await this.authRepository.createUser(name, email, hashedPassword);

      if (!user) throw new Error("Cannot create user please register again");

      const userId = user._id;
      const userRole = UserRole.USER;

      const accessToken = jwt.sign({ userId, role: userRole }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "30m" });
      console.log("after access toke");
      const refreshToken = jwt.sign({ userId, role: userRole }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });

      await RedisClient.del(`otp:${email}`);
      await RedisClient.del(`user_session:${email}`);

      const userDto: UserDto = {
        _id: user._id as string,
        name: user.name,
        email: user.email,
        profileImageUrl:user.profileImageUrl||' ',
        status:user.status,
        role:user.role,
        title:user.title||" ",
         createdAt: user.createdAt || new Date(),
        updatedAt: user.updatedAt || new Date(),
        wishlist: user.wishlist || [],
        savedMentors: user.savedMentors || [],
        skills: user.skills || [],
        DOB: user.DOB || new Date(),
        reviewerRequestStatus: user.reviewerRequestStatus||[]
      };

      return { accessToken, refreshToken, user:userDto };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
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
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async login(email: string, password: string, role: string): Promise<verifiedUer> {
    console.log("login servicel kayri");
    try {
      let user: IAdmin | IUser | null;
      console.log("email", email);

      if (role === "admin") user = await this.authRepository.findAdminByEmail(email);
      else user = await this.authRepository.findUserByEmail(email);

      console.log("login servicel kayri 1", role, user);

      if (!user) throw new Error("Invalid email address");

      if ("status" in user && user.status === "blocked") {
        throw new Error("you have been blocked");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) throw new Error("Incorrect password");

      const userId = user._id;
      const userRole = role === "admin" ? UserRole.ADMIN : UserRole.USER;

      const accessToken = jwt.sign({ userId, role: userRole }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "60m" });

      const refreshToken = jwt.sign({ userId, role: userRole }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });

      console.log("hei last und login servicesl");
      console.log(user, "user from ath login service");

      return { accessToken, refreshToken, user: user as IUser };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async refreshAccessToken(refreshToken: string, role: string): Promise<refreshedUser> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
        userId: string;
        role: string;
      };

      const userId = decoded.userId;
      const userRole = decoded.role as UserRole;

      if (role !== userRole) {
        throw new Error("Role mismatch in refresh token");
      }

      const newAccessToken = jwt.sign({ userId, role: userRole }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "60m" });

      let user;
      if (role === UserRole.ADMIN) {
        user = await this.authRepository.findAdminById(decoded.userId);
      } else {
        user = await this.authRepository.findUserById(decoded.userId);
      }
      console.log(user, "user get from refreshtoke");

      if (!user) {
        throw new Error("cannot find user please try again");
      }

      console.log("after the error throew");

      return { accessToken: newAccessToken, user };
    } catch (error: any) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async sendMagicLink(email: string): Promise<void> {
    try {
      console.log("log from sendMagicLink");

      const user = await this.authRepository.findUserByEmail(email);

      console.log("user from sendmagic link", user);

      if (!user) throw new Error("Invalid email address");

      const token = jwt.sign({ userId: user._id, email, purpose: "reset-password" }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });

      const magicLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

      await sendForgotPasswordMail(email, magicLink);

      await RedisClient.setex(`magicLink:${email}`, 900, JSON.stringify({ magicLink }));
    } catch (error: any) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const { userId, email, purpose } = await verifyResetToken(token, "reset-password");

      if (!userId || purpose !== "reset-password") {
        throw new Error("Invalid token");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.authRepository.updateUserPassword(userId, hashedPassword);

      await RedisClient.del(`magicLink:${email}`);
    } catch (error: any) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  async handleGoogleUser(googleData: { googleId: string; email: string; name: string; profilepic: string }): Promise<verifiedUer> {
    try {
      let user = await this.userRepository.findByGoogleId(googleData.googleId);

      if (!user) {
        user = await this.userRepository.findByEmail(googleData.email);

        if (!user) {
          const dummyPassword = Math.random().toString(36).slice(-8);
          const hashedPassword = await hash(dummyPassword, 10);

          user = await this.authRepository.createGoogleUser(
            googleData.googleId,
            googleData.name,
            hashedPassword,
            googleData.email,
            googleData.profilepic
          );
        } else {
          user.googleId = googleData.googleId;
          await user.save();
        }
      }

      if (!user) throw new Error("Cannot create user please register again");

      const userId = user._id;
      const userRole = UserRole.USER;

      const accessToken = jwt.sign({ userId, role: userRole }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "15m" });
      console.log("after access toke");
      const refreshToken = jwt.sign({ userId, role: userRole }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });

      return { accessToken, refreshToken, user };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
}
