import "dotenv/config";
import { emailWorker } from "./features/email-campaign/email.worker.js";

console.log("Email worker is running...");

emailWorker.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed successfully`);
  console.log(result);
});

emailWorker.on("failed", (job, error) => {
  console.error(`Job ${job?.id} failed:`, error.message);
});

emailWorker.on("error", (error) => {
  console.error("Worker error:", error);
});
