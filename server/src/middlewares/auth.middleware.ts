import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: { id: string };
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    
    const accessToken =req.cookies.accessToken || req.header('Authorization')?.split(' ')[1];

    if (!accessToken) {
      res.status(401).json({ error: 'Unauthorized: No token provided' });
      return;
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw new Error('ACCESS_TOKEN_SECRET is not defined');
    }

    const decoded = jwt.verify(accessToken, secret) as { userId: string };
    (req as AuthRequest).user = { id: decoded.userId };
    console.log((req as AuthRequest).user);

    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};  