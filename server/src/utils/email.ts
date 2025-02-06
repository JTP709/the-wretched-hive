import nodemailer from 'nodemailer';

export default async function sendPasswordResetEmail(email: string, resetLink: string) {
  const transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: "api",
      pass: process.env.MAILTRAP_PASSWORD,
    }
  });

  const message = {
    from: "no-reply@demomailtrap.com",
    to: email,
    subject: "Password Reset",
    text: `You requested a password reset, use this link to reset: ${resetLink}`,
  };

  await transporter.sendMail(message)
};
