import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { IUser } from "../models/User";
import { StatusCodes } from "http-status-codes";
import { decode } from "punycode";
import { UserRole } from "../core/constants/user.enum";

declare module "express-serve-static-core" {
  interface Request {
    user?: Partial<IUser>;
    file?: Express.Multer.File;
  }
}

export const authMiddleware = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken =
        req.cookies.accessToken || req.header("Authorization")?.split(" ")[1];

      if (!accessToken)
        res.status(401).json({ error: "Unauthorized: No token provided" });

      const decoded = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET!
      ) as { userId: string; role: string };

      if (roles.length && !roles.includes(decoded.role as UserRole)) {
        res.status(StatusCodes.FORBIDDEN).json({ message: "permisson denied" });
        return;
      }

      req.user = { _id: decoded.userId };
      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        res.status(401).json({ error: "Token has expired" });
        return;
      }
      res.status(403).json({ error: "Invalid token" });
    }
  };
};
