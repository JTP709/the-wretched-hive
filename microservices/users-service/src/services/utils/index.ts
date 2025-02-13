import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "access_secret";
export const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh_secret";

export const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

export default async function sendPasswordResetEmail(
  email: string,
  resetLink: string
) {
  const transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "api",
      pass: process.env.MAILTRAP_PASSWORD,
    },
  });

  const message = {
    from: "no-reply@demomailtrap.com",
    to: email,
    subject: "Password Reset",
    text: `You requested a password reset, use this link to reset: ${resetLink}`,
  };

  await transporter.sendMail(message);
}
