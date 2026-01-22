import Redis from "ioredis";
import { fixedWindowCounter } from "./algorithms/fixedWindow.js";
import { slidingWindowLog } from "./algorithms/slidingWindowLog.js";
import { slidingWindowCounter } from "./algorithms/slidingWindowCounter.js";
const redis = new Redis();

redis.on("error", (e) => {
  console.log({
    message: "Error occured from redis",
    details: e.message || "Make sure Redis is running (check docker)",
  });
});

export const stratergies = {
  fixed: fixedWindowCounter,
  slidingLog: slidingWindowLog,
  slidingCounter: slidingWindowCounter,
};

export const RATE_LIMIT_CONFIG = {
  default: {
    algorithm: "slidingCounter",
    limit: 5,
    window: 60, // seconds
  },

  routes: {
    "/api/users": {
      algorithm: "slidingCounter",
      limit: 5,
      window: 60,
    },

    "/api/orders": {
      algorithm: "slidingCounter",
      limit: 10,
      window: 60,
    },
  },
};

export default redis;
