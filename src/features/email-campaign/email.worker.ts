import { Worker } from "bullmq";
import { emailJob } from "./email-job.service.js";
import redisConnection from "../../config/redis.js";
import type { EmailJobData } from "./email-job.types.js";

export const emailWorker = new Worker<EmailJobData>(
  "email-queue",
  async (job) => {
    return await emailJob(job.data);
  },
  {
    connection: redisConnection,
    concurrency: 1,
  },
);
