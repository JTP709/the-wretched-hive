import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthRequest } from '../types';
import { ACCESS_TOKEN_SECRET } from '../utils';

const authentication = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies?.accessToken;

  if (!accessToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    (req as AuthRequest).userId = (decoded as JwtPayload).userId;
    next();
  } catch {
    res.status(403).json({ message: "Forbidden" })
  }
}

export default authentication;