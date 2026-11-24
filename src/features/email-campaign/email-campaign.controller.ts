import type { Request, Response, NextFunction } from "express";
import { createEmailCampaign } from "./email-job.service.js";

export async function createEmailCampaignController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await createEmailCampaign(req.body);
    return res.status(202).json({
      success: true,
      message: "Email campaign queued successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
