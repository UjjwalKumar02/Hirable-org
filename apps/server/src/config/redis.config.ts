import Redis from "ioredis";
import "dotenv/config";

export const redisConnection = {
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};

export const redis = new Redis.default(redisConnection);

// Connection log
(async () => {
  console.log(await redis.ping());
})();
