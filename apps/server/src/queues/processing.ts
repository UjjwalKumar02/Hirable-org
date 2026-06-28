import { redis } from "../lib/redis.js";
import type { Queue, QueueJob } from "./types.js";

export async function addToProcessing({
  queue,
  job,
}: {
  queue: Queue;
  job: QueueJob;
}) {
  await redis.hset(`${queue}:processing`, job.id, JSON.stringify(job));
}

export async function removeFromProcessing({
  queue,
  job,
}: {
  queue: Queue;
  job: QueueJob;
}) {
  await redis.hdel(`${queue}:processing`, job.id);
}
