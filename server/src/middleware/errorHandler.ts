// errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

// Global error handling middleware
const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  const { url, params, query, body, userId } = req as AuthRequest;
  const { statusCode, message, stack } = error;
  console.error(`Error has occurred for request: ${url}`, {
    userId,
    params,
    query,
    body,
    error,
  });

  res.status(statusCode || 500).json({
    message: message || 'Internal Server Error',
    // Optionally include the stack trace in development mode
    ...(process.env.NODE_ENV === 'development' && { stack: stack }),
  });
};

export default errorHandler;
