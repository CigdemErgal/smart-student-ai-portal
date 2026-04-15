import { createClient } from "redis";

const redisClient = createClient();

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected successfully");
  } catch (error) {
    console.error("Redis connection error:", error);
    process.exit(1);
  }
};

export default redisClient;
