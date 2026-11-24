import prisma from "../../config/prisma.js";
import { emailGenerator } from "../../generators/email.generator.js";
import { sendMail } from "../../mailer/mail.service.js";
import type { SendMailOptions, SMTPConfig } from "../../mailer/mail.types.js";
import { decrypt } from "../../utils/encryption.js";
import { getSMTPAccount } from "../smtp-account/smtp-account.service.js";
import { createEmailJob } from "./email-campaign.service.js";
import type { CreateEmailCampaignInput } from "./email-campaign.types.js";
import type { EmailJobData } from "./email-job.types.js";

export async function emailJob(data: EmailJobData) {
  const account = await getSMTPAccount(data.smtpAccountId);

  const decryptedPass = decrypt(account.encryptedPass);

  const smtp: SMTPConfig = {
    user: account.email,
    pass: decryptedPass,
  };

  const mailOption: SendMailOptions = {
    from: account.email,
    to: data.to,
    subject: data.subject,
    text: data.text,
  };

  const result = await sendMail(
    data.smtpAccountId.toString(),
    smtp,
    mailOption,
  );

  await prisma.sentEmail.create({
    data: {
      username: data.username,
      email: data.to,
      smtpAccountId: data.smtpAccountId,
    },
  });

  return result;
}

export async function createEmailCampaign(data: CreateEmailCampaignInput) {
  const { smtpAccountId, usernames, subject, text } = data;

  if (!Number.isInteger(smtpAccountId) || smtpAccountId <= 0) {
    throw new Error("Invalid SMTP account ID");
  }

  if (!Array.isArray(usernames) || usernames.length === 0) {
    throw new Error("Please provide at least one username");
  }

  if (
    usernames.some(
      (username) => typeof username !== "string" || !username.trim(),
    )
  ) {
    throw new Error("All usernames must be valid non-empty strings");
  }

  if (typeof subject !== "string" || !subject.trim()) {
    throw new Error("Email subject is required");
  }

  if (typeof text !== "string" || !text.trim()) {
    throw new Error("Email message is required");
  }

  const account = await prisma.sMTPAccount.findUnique({
    where: { id: smtpAccountId },
    select: { id: true },
  });

  if (!account) {
    throw new Error("SMTP account not found");
  }

  const candidates: { username: string; email: string }[] = [];

  for (const username of usernames) {
    candidates.push({
      username,
      email: emailGenerator(username),
    });
  }

  const uniqueCandidates = [
    ...new Map(
      candidates.map((candidate) => [candidate.username, candidate]),
    ).values(),
  ];

  const existingRecords = await prisma.sentEmail.findMany({
    where: {
      smtpAccountId,
      username: {
        in: uniqueCandidates.map((candidate) => candidate.username),
      },
    },
    select: {
      username: true,
    },
  });

  const alreadySent = new Set(existingRecords.map((record) => record.username));

  const pendingCandidates = uniqueCandidates.filter(
    (candidate) => !alreadySent.has(candidate.username),
  );

  const jobs = await Promise.all(
    pendingCandidates.map((candidate) =>
      createEmailJob({
        smtpAccountId,
        username: candidate.username,
        to: candidate.email,
        subject,
        text,
      }),
    ),
  );

  return {
    totalSubmitted: usernames.length,
    totalUnique: uniqueCandidates.length,
    previouslySent: existingRecords.length,
    jobsQueued: jobs.length,
    pendingCandidates,
  };
}
