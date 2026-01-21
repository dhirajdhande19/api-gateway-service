import Redis from "ioredis";
import { fixedWindowCounter } from "./algorithms/fixedWindow.js";
import { slidingWindowLog } from "./algorithms/slidingWindowLog.js";
const redis = new Redis();

redis.on("error", (e) => {
  console.log({ message: "Error occured from redis", details: e.message });
});

export const stratergies = {
  fixed: fixedWindowCounter,
  slidingLog: slidingWindowLog,
};

export const RATE_LIMIT_CONFIG = {
  default: {
    algorithm: "slidingLog", // fixed
    limit: 5,
    window: 60, // seconds
  },

  routes: {
    "/api/users": {
      algorithm: "slidingLog",
      limit: 5,
      window: 60,
    },

    "/api/orders": {
      algorithm: "slidingLog",
      limit: 10,
      window: 60,
    },
  },
};

export default redis;
