import { redis } from "../lib/redis.js";
import type { Queue, QueueJob } from "./types.js";

export async function retry({ queue, job }: { queue: Queue; job: QueueJob }) {
  const delay = Date.now() + 2000 * Math.pow(2, job.attempts);
  await redis.zadd(`${queue}:retry`, delay, JSON.stringify(job));
}
