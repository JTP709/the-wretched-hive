import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../model";
import { NewUserInfo } from "../types/global";
import { generateAccessToken, generateRefreshToken, REFRESH_TOKEN_SECRET, sendPasswordResetEmail } from "../utils";
import { Op } from "sequelize";

export const createNewUser = async (userInfo: NewUserInfo) => {
  const {
    username,
    password,
    email,
    firstName,
    lastName,
    streetAddress,
    streetAddressTwo,
    city,
    planet,
    postalCode,
  } = userInfo;
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    throw new Error("Username already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  return await User.create({
    username,
    password: hashedPassword,
    email,
    firstName,
    lastName,
    streetAddress,
    streetAddressTwo,
    city,
    planet,
    postalCode,
  });
};

export const authenticateUser = async (username: string, password: string) => {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new Error("Incorrect username or password");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
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
};

export const refreshAuthToken = async (refreshToken: string) => {
  const { userId } = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { userId: number };
  const user = await User.findByPk(userId);

  if (!user || user.refreshToken !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  return generateAccessToken(user.id);
};

export const requestResetPasswordEmail = async (email: string) => {
    const user = await User.findOne({ where: { email }});
    if (!user) {
      return;
    }

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

export const resetUserPassword = async (token: string, password: string) => {
  const hashedFromReq = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    where: {
      resetPasswordToken: hashedFromReq,
      resetPasswordExpires: {
        [Op.gt]: new Date()
      }
    },
  });

  if (!user) {
    throw new Error("Invalid or expired token");
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();

  return;
};
