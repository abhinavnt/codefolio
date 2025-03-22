import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


export interface AuthRequest extends Request {
    user?: {
      id: string;
    };
  }


  export const authMiddleware=(req:AuthRequest,res:Response,next:NextFunction)=>{
    try {
        const accessToken=req.cookies.accessToken || req.header("Authorization")?.split(" ")[1];

        if (!accessToken)
            res.status(401).json({ error: "Unauthorized: No token provided" });


        const decoded=jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET!)as {userId:string}

        req.user={id:decoded.userId}
        console.log(req.user);
        
        next()

    } catch (error) {
        res.status(403).json({ error: "Invalid token" });
    }
  }