import express from "express";
import emailCampaignRoutes from "./features/email-campaign/email-campaign.routes.js";
import smtpAccountRoutes from "./features/smtp-account/smtp-account.routes.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/smtp-accounts", smtpAccountRoutes);
app.use("/api/email-campaigns", emailCampaignRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
