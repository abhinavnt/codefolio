import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const RedisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

RedisClient.on("connect", () => {
  console.log("Connected to Redis");
});

RedisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export { RedisClient };