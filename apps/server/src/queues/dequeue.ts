import { redis } from "../lib/redis.js";
import type { Queue } from "./types.js";

export async function dequeue({ queue }: { queue: Queue }) {
  const raw = await redis.rpop(queue);
  if (!raw) {
    return null;
  }

  try {
    const parsedData = JSON.parse(raw);
    return parsedData;
  } catch (error) {
    console.log(`JSON parsing of Queue ${queue} element failed: ${error}`);
    return null;
  }
}
