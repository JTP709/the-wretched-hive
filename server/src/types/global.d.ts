import { Request } from "express";

type User = {
  id: number,
  username: string,
  password: string,
}

interface AuthRequest extends Request {
  userId: string;
}

interface NewUserInfo {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  streetAddress: string;
  streetAddressTwo: string;
  city: string;
  planet: string;
  postalCode: string;
}
