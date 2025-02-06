import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { CookieOptions, Request, Response } from 'express';
import User from '../model/User';
import { generateAccessToken, generateRefreshToken, handleErrors, REFRESH_TOKEN_SECRET, sendPasswordResetEmail } from '../utils';
import { generateCsrfToken } from '../utils/token';
import { Op } from 'sequelize';

const baseTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
};

const baseCsrfCookieOptions: CookieOptions = {
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
};

export const signup = async (req: Request, res: Response) => {
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
  } = req.body;

  if (!username || !password ) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      res.status(400).json({ message: "Username already exists" })
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
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
    
    res.status(201)
      .json({
        message: "User created successfully",
        user: { id: newUser.id, username: newUser.username},
      });
  } catch (err) {
    handleErrors(res, err);
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(401).json({ message: "Incorrect username or password" });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: "Incorrect username or password" });
      return;
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    const csrfToken = generateCsrfToken();

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('accessToken', accessToken, {
      ...baseTokenCookieOptions,
      maxAge: 15 * 60 *1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      ...baseTokenCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie('XSRF-TOKEN', csrfToken, baseCsrfCookieOptions)

    res.status(201).json({ message: 'Login successful' });
  } catch (err) {
    handleErrors(res, err);
  }
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(404);
    return;
  }

  try {
    const user = await User.findOne({ where: { refreshToken } });
    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie('accessToken', baseTokenCookieOptions)
    res.clearCookie('refreshToken', baseTokenCookieOptions);
    res.clearCookie('XSRF-TOKEN', baseCsrfCookieOptions);

    res.status(204).json({ message: 'Logout successful' });
  } catch (err) {
    handleErrors(res, err);
  }
};

export const refresh_token = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const { userId } = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { userId: number };
    const user = await User.findByPk(userId);

    if (!user || user.refreshToken !== refreshToken) {
      res.status(403).json({ message: "Invalid refresh token" });
      return;
    }

    const newAccessToken = generateAccessToken(user.id);
    res.cookie('accessToken', newAccessToken, {
      ...baseTokenCookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json({ message: "Token refreshed" });
  } catch (err) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

export const forgot_password = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  try {
    const user = await User.findOne({ where: { email }});
    if (!user) {
      res.status(200).json({ message: "If the email exists, reset instructions were sent" });
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

    res.status(200).json({ message: "If the email exists, reset instructions were sent" });
  } catch (err) {
    handleErrors(res, err);
  }
};

export const reset_password = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    res.status(400).json({ message: "Token and new password are required" });
    return;
  }

  const hashedFromReq = crypto.createHash("sha256").update(token).digest("hex");

  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedFromReq,
        resetPasswordExpires: {
          [Op.gt]: new Date()
        }
      },
    });

    if (!user) {
      res.status(400).json({ message: "Invalid or expired token" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    handleErrors(res, err);
  }
};
