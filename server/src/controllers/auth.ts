import { Request, Response } from 'express';
import { handleErrors } from '../utils';
import { baseTokenCookieOptions } from '../utils/cookieOptions';
import { authenticateUser, createNewUser, refreshAuthToken, requestResetPasswordEmail, resetUserPassword, revokeRefreshToken } from '../services';
import { NewUserInfo } from '../types/global';

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

  const userInfo: NewUserInfo = {
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
  }
  const missingFields = Object.keys(userInfo)
    .filter(val => val !== 'streetAddressTwo')
    .reduce((accum, val) => {
      if (!(userInfo as unknown as { [k: string]: string | undefined })[val]) accum.push(val);
      return accum;
    }, [] as string[]);

  if (missingFields.length > 0) {
    res.status(400).json({ message: `The following fields are required: ${missingFields}` });
    return;
  }

  try {
    const newUser = await createNewUser(userInfo);
    
    res.status(201)
      .json({
        message: "User created successfully",
        user: { id: newUser.id, username: newUser.username},
      });
  } catch (err) {
    if ((err as Error)?.message === "Username already exists") {
      res.status(400).json({ message: (err as Error)?.message });
    } else {
      handleErrors(res, err);
    }
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  try {
    const { accessToken, refreshToken } = await authenticateUser(username, password);

    res.cookie('accessToken', accessToken, {
      ...baseTokenCookieOptions,
      maxAge: 15 * 60 *1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      ...baseTokenCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({ message: 'Login successful' });
  } catch (err) {
    const error = err as Error;
    if (error?.message === "Incorrect username or password") {
      res.status(401).json({ message: "Incorrect username or password" });
    } else {
      handleErrors(res, err);
    }
  }
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.status(404);
    return;
  }

  try {
    await revokeRefreshToken(refreshToken);

    res.clearCookie('accessToken', baseTokenCookieOptions)
    res.clearCookie('refreshToken', baseTokenCookieOptions);

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
    const newAccessToken =  await refreshAuthToken(refreshToken);
    res.cookie('accessToken', newAccessToken, {
      ...baseTokenCookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json({ message: "Token refreshed" });
  } catch (err) {
    res.status(403).json({ message: (err as Error)?.message || "Invalid or expired refresh token" });
  }
};

export const forgot_password = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  try {
    await requestResetPasswordEmail(email);

    res.status(200).json({ message: "If the email exists, reset instructions were sent" });
  } catch (err) {
    handleErrors(res, err);
  }
};

export const reset_password = async (req: Request, res: Response) => {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400).json({ message: "Token and new password are required" });
    return;
  }

  try {
    await resetUserPassword(token, password);

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    if ((err as Error)?.message === "Invalid or expired token") {
      res.status(400).json({ message: "Invalid or expired token" });
    } else {
      handleErrors(res, err);
    }
  }
};
