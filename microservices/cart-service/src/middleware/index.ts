import { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (err: any, _: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  console.error(err);
  res.status(statusCode).json({
    message,
    ...err(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
