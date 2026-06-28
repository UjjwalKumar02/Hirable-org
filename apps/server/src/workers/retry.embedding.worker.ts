import { redis } from "../lib/redis.js";
import { sleepWithBackoff } from "../utils/sleepWithExponentialDelay.js";

async function retryWorker() {
  while (true) {
    try {
      const jobs = await redis.zrangebyscore("embedding:retry", 0, Date.now());

      console.log(
        `Retry jobs from Embedding retry worker: ${JSON.stringify(jobs)}`,
      );

      for (const job of jobs) {
        await redis.zrem("embedding:retry", job);
        await redis.lpush("embedding", job);
      }
    } catch (error) {
      console.log(`Embedding retry worker failed: ${error}`);
    }

    await sleepWithBackoff();
  }
}

(async () => {
  try {
    await retryWorker();
    console.log("Embedding retry worker is running...");
  } catch (error) {
    console.log("Embedding retry worker startup error: ", error);
  }
})();
