import type { SendMailOptions, SMTPConfig } from "./mail.types.js";

export function validateMailOptions(options: SendMailOptions): void {
  if (!options.from.trim()) {
    throw new Error("Sender email is required.");
  }
  if (!options.to.trim()) {
    throw new Error("Recipient email is required.");
  }

  if (!options.subject.trim()) {
    throw new Error("Email subject is required.");
  }

  if (!options.text.trim()) {
    throw new Error("Email body is required.");
  }
}

export function validateSMTPConfig(config: SMTPConfig): void {
  if (!config.user.trim()) {
    throw new Error("SMTP username is required.");
  }

  if (!config.pass) {
    throw new Error("SMTP password is required.");
  }
}
