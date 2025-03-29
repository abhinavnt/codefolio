import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { IUser } from "../models/User";
import { File } from "buffer";
import { Multer } from "multer";

// export interface Request extends Request {
//   user?: {
//     id: string;
//   };
// }

declare module "express-serve-static-core"{
  interface Request {
    user?: Partial<IUser>
    file?: Express.Multer.File
  }
 }

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken =
      req.cookies.accessToken || req.header("Authorization")?.split(" ")[1];
    if (!accessToken)
      res.status(401).json({ error: "Unauthorized: No token provided" });


    const decoded = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!
    ) as { userId: string };

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