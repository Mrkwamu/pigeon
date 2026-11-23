import { sendMail } from "../mailer/mail.service.js";
import { verifyConnection } from "../mailer/mail.transporter.js";
import type { SendMailOptions, SMTPConfig } from "../mailer/mail.types.js";

const smtp: SMTPConfig = {
  user: process.env.SMTP_USER!,
  pass: process.env.SMTP_PASS!,
};

const mail: SendMailOptions = {
  from: smtp.user,
  to: "kevinmcostnerhq@gmail.com",
  subject: "Nodemailer Test",
  text: "Hello! This is a test email from my Express application.",
};

async function testMail() {
  try {
    console.log("Checking SMTP connection...");

    await verifyConnection(smtp);

    console.log("SMTP verification successful!");

    console.log("Sending test email...");

    const result = await sendMail("test-account-1", smtp, mail);

    console.log("Email submitted successfully!");
    console.log("Message ID:", result.messageId);
    console.log("Accepted:", result.accepted);
    console.log("Rejected:", result.rejected);
  } catch (error) {
    console.error("Mail test failed:", error);
  }
}

testMail();
