import { Queue } from "bullmq";
import { redisConnection } from "../lib/redis.js";

export const embeddingQueue = new Queue("embedding_queue", {
  connection: redisConnection,
});

export const embeddingDLQ = new Queue("embedding_dlq", {
  connection: redisConnection,
});
