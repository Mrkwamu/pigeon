import { Router } from "express";
import { createEmailCampaignController } from "./email-campaign.controller.js";

const router = Router();

router.post("/", createEmailCampaignController);

export default router;
