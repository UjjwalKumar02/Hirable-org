import { Queue } from "bullmq";
import { redisConnection } from "../lib/redis.js";

export const emailQueue = new Queue("email_queue", {
  connection: redisConnection,
});

export const emailDLQ = new Queue("email_dlq", {
  connection: redisConnection,
});
