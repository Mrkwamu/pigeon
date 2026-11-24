import type { EmailJobData } from "./email-job.types.js";
import { emailQueue } from "./email.queue.js";

export async function createEmailJob(data: EmailJobData) {
  const job = await emailQueue.add("send-email", data);

  return job;
}
