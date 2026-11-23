import { MailDeliveryError } from "./mail.errors.js";
import { createTransporter } from "./mail.transporter.js";
import type { SendMailOptions, SMTPConfig } from "./mail.types.js";
import { validateMailOptions, validateSMTPConfig } from "./mail.validator.js";
import transporterManager from "./transport.manager.js";

const RETRYABLE_CODES = new Set([
  "ECONNECTION",
  "ETIMEDOUT",
  "ESOCKET",
  "ECONNRESET",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "EAI_AGAIN",
]);

function isRetryableError(error: {
  code?: string;
  responseCode?: number;
}): boolean {
  if (error.code && RETRYABLE_CODES.has(error.code)) {
    return true;
  }

  return (
    error.responseCode !== undefined &&
    error.responseCode >= 400 &&
    error.responseCode < 500
  );
}

export async function sendMail(
  accountId: string,
  smtp: SMTPConfig,
  mail: SendMailOptions,
) {
  validateSMTPConfig(smtp);
  validateMailOptions(mail);

  const transporter = transporterManager.getTransporter(accountId, smtp);
  try {
    return await transporter.sendMail(mail);
  } catch (error: unknown) {
    if (!(error instanceof Error)) {
      throw error;
    }

    const mailError = error as Error & {
      code?: string;
      responseCode?: number;
    };

    throw new MailDeliveryError("Failed to send email.", {
      cause: error,
      code: mailError.code,
      responseCode: mailError.responseCode,
      retryable: isRetryableError(mailError),
    });
  }
}
