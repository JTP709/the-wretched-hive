import { Request, Response } from "express";
import { AuthRequest } from "../types/global";
import { User } from "../model";

export const get_user = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  
  try {
    const user = await User.findOne({
      attributes: ['username'],
      where: {
        id: userId,
      },
    });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
