import type { Request, Response, NextFunction } from "express";
import {
  createSMTPAccount,
  updateSMTPAccountPassword,
} from "./smtp-account.service.js";

export async function createSMTPAccountController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const account = await createSMTPAccount(req.body);

    return res.status(201).json({
      success: true,
      message: "SMTP account created successfully",
      data: account,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateSMTPAccountPasswordController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, pass } = req.body;

    const account = await updateSMTPAccountPassword(email, pass);

    return res.status(200).json({
      success: true,
      message: "SMTP account password updated successfully",
      data: account,
    });
  } catch (error) {
    next(error);
  }
}
