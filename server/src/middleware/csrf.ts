import { NextFunction, Request, Response } from "express";
import { generateCsrfToken } from '../utils/token';
import { baseCsrfCookieOptions } from '../utils';

const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  const csrfCookie = req.cookies['XSRF-TOKEN'];
  
  if (req.method === "GET" || req.method === "HEAD") {
    if (!csrfCookie) {
      const token = generateCsrfToken();
      res.cookie("XSRF-TOKEN", token, baseCsrfCookieOptions);
    }
  } else {
    const csrfHeader = req.headers['x-csrf-token'];
  
    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      res.status(403).json({ message: 'CSRF validation failed' });
      return;
    }
  }

  next();
};

export default csrfProtection;
