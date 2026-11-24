import { Queue } from "bullmq";

import type { EmailJobData } from "./email-job.types.js";
import redisConnection from "../../config/redis.js";

export const emailQueue = new Queue<EmailJobData>("email-queue", {
  connection: redisConnection,
});
