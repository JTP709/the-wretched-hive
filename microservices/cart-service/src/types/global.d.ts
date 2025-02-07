import { Request } from "express";

type User = {
  id: number,
  username: string,
  password: string,
}

interface AuthRequest extends Request {
  userId: string;
}