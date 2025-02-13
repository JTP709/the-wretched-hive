import { Request, Response } from "express";
import { handleErrors } from "../utils";
import { baseTokenCookieOptions } from "../utils/cookieOptions";
import {
  authenticateUser,
  createNewUser,
  refreshAuthToken,
  requestResetPasswordEmail,
  resetUserPassword,
  revokeRefreshToken,
} from "../services";
import {
  ForgotPassword,
  Login,
  Logout,
  RefreshToken,
  SignUp,
} from "../grpc/usersClient";
import { UsersActionType } from "../types/enums";

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

  const missingFields = [];
  if (!username) missingFields.push("username");
  if (!password) missingFields.push("password");
  if (!email) missingFields.push("email");
  if (!firstName) missingFields.push("firstName");
  if (!lastName) missingFields.push("lastName");
  if (!streetAddress) missingFields.push("streetAddress");
  if (!streetAddressTwo) missingFields.push("streetAddressTwo");
  if (!city) missingFields.push("city");
  if (!planet) missingFields.push("planet");
  if (!postalCode) missingFields.push("postalCode");
  if (missingFields.length) {
    res.status(400).json({
      message: `The following fields are required: ${missingFields.join(", ")}`,
    });
    return;
  }

  const {
    data: newUser,
    message,
    type,
  } = await SignUp(
    username,
    password,
    email,
    firstName,
    lastName,
    streetAddress,
    streetAddressTwo,
    city,
    planet,
    postalCode
  );

  if (message === "Username already exists") {
    res.status(400).json({
      message: "Username already exists",
    });
  } else if (type === UsersActionType.SUCCESS) {
    res.status(201).json({
      message: "User created successfully",
      user: { id: newUser.id, username: newUser.username },
    });
  } else {
    console.log("Sign up error:", message);
    res.status(500).json({ message: message || "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  const { type, data, message } = await Login(username, password);
  if (type === UsersActionType.SUCCESS) {
    const { accessToken, refreshToken } = data;

    res.cookie("accessToken", accessToken, {
      ...baseTokenCookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
      ...baseTokenCookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({ message: "Login successful" });
  } else if (type === UsersActionType.CONFLICT) {
    res.status(401).json({ message: "Incorrect username or password" });
  } else {
    res.status(500).json({ message: message || "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  res.clearCookie("accessToken", baseTokenCookieOptions);
  res.clearCookie("refreshToken", baseTokenCookieOptions);

  if (!refreshToken) {
    res.status(400).json({ message: "Refresh token is required" });
    return;
  }

  await Logout(refreshToken);

  res.status(204).json({ message: "Logout successful" });
};

export const refresh_token = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const {
    type,
    data: newAccessToken,
    message,
  } = await RefreshToken(refreshToken);

  if (type === UsersActionType.SUCCESS) {
    res.cookie("accessToken", newAccessToken, {
      ...baseTokenCookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.status(200).json({ message: "Token refreshed" });
  } else if (type === UsersActionType.FORBIDDEN) {
    res
      .status(403)
      .json({ message: message || "Invalid or expired refresh token" });
  } else {
    res.status(500).json({ message: message || "Internal server error" });
  }
};

export const forgot_password = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  const { type, message } = await ForgotPassword(email);

  if (type === UsersActionType.SUCCESS) {
    res.status(200).json({
      message: message || "If the email exists, reset instructions were sent",
    });
  } else {
    res.status(500).json({ message: message || "Internal server error" });
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
