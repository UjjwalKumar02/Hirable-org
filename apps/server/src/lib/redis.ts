import Redis from "ioredis";
import "dotenv/config";

export const redis = new Redis.default(process.env.UPSTASH_REDIS_URL!);

(async () => {
  await redis.set("Admin", "Ujjwal");
  const res = await redis.get("Admin");
  console.log(res);
})();
