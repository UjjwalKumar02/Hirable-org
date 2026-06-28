import { redis } from "../lib/redis.js";
import { sleepWithBackoff } from "../utils/sleepWithExponentialDelay.js";

async function retryWorker() {
  while (true) {
    try {
      const jobs = await redis.zrangebyscore("email:retry", 0, Date.now());

      console.log(
        `Retry jobs from Email retry worker: ${JSON.stringify(jobs)}`,
      );

      for (const job of jobs) {
        await redis.zrem("email:retry", job);
        await redis.lpush("email", job);
      }
    } catch (error) {
      console.log(`Email retry worker failed: ${error}`);
    }

    await sleepWithBackoff();
  }
}

(async () => {
  try {
    await retryWorker();
    console.log("Email retry worker is running...");
  } catch (error) {
    console.log("Email retry worker startup error: ", error);
  }
})();
