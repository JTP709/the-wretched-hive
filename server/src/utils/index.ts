import { Response } from "express";

export const handleErrors = (res: Response, err: any) => {
  console.error(err);
  res.status(500).json({ message: (err as Error)?.message || 'Internal server error' });
};
