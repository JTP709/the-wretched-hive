import { Request, Response } from "express";
import { AuthRequest } from "../types";
import { getUser } from "../services";
import { UsersActionType } from "../services/users";
import { handleErrors } from "../utils";

export const get_user = async (req: Request, res: Response) => {
  const userId = (req as AuthRequest).userId;
  
  const { type, data, message } = await getUser(userId);
  switch(type) {
    case UsersActionType.SUCCESS:
      res.status(200).json(data);
      return;
    case UsersActionType.NOT_FOUND:
      res.status(404).json({ message });
      return;
    default:
      console.log("Get user service did not return a known action type:", type);
      res.status(500).json({ message: "Internal server error" });
      return;
  }
};
