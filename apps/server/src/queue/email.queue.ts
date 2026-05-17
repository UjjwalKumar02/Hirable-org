import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.config.js";

export const emailQueue = new Queue("email_queue", {
  connection: redisConnection,
});

export const emailDLQ = new Queue("email_dlq", {
  connection: redisConnection,
});
