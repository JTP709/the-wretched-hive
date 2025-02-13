import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models";
import sendPasswordResetEmail, {
  generateAccessToken,
  generateRefreshToken,
  REFRESH_TOKEN_SECRET,
} from "./utils";

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

export const revokeRefreshToken = async (refreshToken: string) => {
  const user = await User.findOne({ where: { refreshToken } });
  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  return;
};

export const refreshAccessToken = async (refreshToken: string) => {
  const { userId } = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as {
    userId: number;
  };
  const user = await User.findByPk(userId);

  if (!user || user.refreshToken !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  return generateAccessToken(user.id);
};

export const requestResetPasswordEmail = async (email: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) return;

  const token = crypto.randomBytes(32).toString("hex");
  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  user.resetPasswordToken = hashed;
  user.resetPasswordExpires = expires;
  await user.save();

  const resetLink = `http://localhost:3000/reset-password?token=${token}`;
  await sendPasswordResetEmail(user.email, resetLink);

  return;
};
