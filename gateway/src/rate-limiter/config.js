import Redis from "ioredis";
import { fixedWindowCounter } from "./algorithms/fixedWindow.js";
import { slidingWindowLog } from "./algorithms/slidingWindowLog.js";
import { slidingWindowCounter } from "./algorithms/slidingWindowCounter.js";
import { tokenBucket } from "./algorithms/tokenBucket.js";
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
  tokenBucket: tokenBucket,
};

export const RATE_LIMIT_CONFIG = {
  /*
    Note:
    for tokenBucket algorithm we need to pass this extra field:
    refillRate: n/60; (ex. n tokens / minute) or (refillRate: n // here token will be filled at a speed of n token/sec)
  */

  default: {
    algorithm: "tokenBucket",
    limit: 5,
    window: 60, // seconds
    refillRate: 5 / 60, // fill 5 tokens/minute
  },

  routes: {
    "/api/users": {
      algorithm: "tokenBucket",
      limit: 2,
      window: 60,
      refillRate: 5 / 60,
    },

    "/api/orders": {
      algorithm: "tokenBucket",
      limit: 2,
      window: 60,
      refillRate: 6 / 60,
    },
  },
};

export default redis;
