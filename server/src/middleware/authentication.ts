import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthRequest } from '../types/global';

const authentication = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(403).json({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, 'secret_key');
    (req as AuthRequest).userId = (decoded as JwtPayload).id;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" })
  }
}

export default authentication;