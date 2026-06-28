import { randomUUID } from "crypto";
import { redis } from "../lib/redis.js";
import type { Queue, QueueJob, QueueJobType } from "./types.js";

export async function enqueue({
  queue,
  type,
  payload,
}: {
  queue: Queue;
  type: QueueJobType;
  payload: any;
}) {
  const job: QueueJob = {
    id: randomUUID(),
    type,
    payload,
    createdAt: Date.now(),
    attempts: 0,
    maxAttempts: 2,
  };

  await redis.lpush(queue, JSON.stringify(job));

  return job.id;
}
