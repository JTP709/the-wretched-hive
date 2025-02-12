import bcrypt from "bcryptjs";
import { User } from "../models";
import { generateAccessToken, generateRefreshToken } from "./utils";

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

export const authenticateUser = async (username: string, password: string) => {
  const user = await User.findOne({ where: { username } });
  if (!user) {
    throw new Error("Incorrect username or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Incorrect username or password");
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  user.refreshToken = refreshToken;
  await user.save();

  return { accessToken, refreshToken };
};
