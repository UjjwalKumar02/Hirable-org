import { redis } from "../lib/redis.js";
import type { Queue, QueueJob } from "./types.js";

export async function moveToDead({
  queue,
  job,
  error,
}: {
  queue: Queue;
  job: QueueJob;
  error?: string;
}) {
  const deadJob = {
    ...job,
    failedAt: Date.now(),
    failureReason: error,
  };

  await redis.lpush(`${queue}:dead`, JSON.stringify(deadJob));
}
