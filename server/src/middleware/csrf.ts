import { NextFunction, Request, Response } from "express";

export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  const csrfCookie = req.cookies['XSRF-TOKEN'];
  const csrfHeader = req.headers['x-csrf-token'];

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    res.status(403).json({ message: 'CSRF validation failed' });
    return;
  }

  next();
};
