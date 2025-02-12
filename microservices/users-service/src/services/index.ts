import bcrypt from "bcryptjs";
import { User } from "../models";

export const createNewUser = async (userInfo: NewUserInfo) => {
  const { username, password } = userInfo;
  const existingUser = await User.findOne({ where: { username } });
  
  if (existingUser) {
    throw new Error("Username already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return await User.create({
    ...userInfo,
    password: hashedPassword,
  });
};
