import nodemailer from "nodemailer";
import type { SMTPConfig } from "./mail.types.js";

export function createTransporter({ user, pass }: SMTPConfig) {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user,
      pass,
    },

    pool: true,
    maxConnections: 1,
    maxMessages: 100,
  });
}

export async function verifyConnection(smtp: SMTPConfig) {
  const transporter = createTransporter(smtp);
  try {
    await transporter.verify();
    console.log("Server is ready to take our messages");
  } catch (err) {
    console.error("Verification failed:", err);
  }
}
