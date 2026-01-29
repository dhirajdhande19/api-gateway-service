import Redis from "ioredis";
import { fixedWindowCounter } from "./algorithms/fixedWindow.js";
import { slidingWindowLog } from "./algorithms/slidingWindowLog.js";
import { slidingWindowCounter } from "./algorithms/slidingWindowCounter.js";
import { tokenBucket } from "./algorithms/tokenBucket.js";
import { leakyBucket } from "./algorithms/leakyBucket.js";
import { REDIS_URL } from "../config/env.js";
const redis = new Redis(REDIS_URL);

redis.on("error", (e) => {
  console.error({
    message: "Error occured from redis",
    details: e.message || "Make sure Redis is running (check docker)",
  });
});

redis.on("connect", () => {
  console.log("Redis Connected");
});

export const stratergies = {
  fixed: fixedWindowCounter,
  slidingLog: slidingWindowLog,
  slidingCounter: slidingWindowCounter,
  tokenBucket: tokenBucket,
  leakyBucket: leakyBucket,
};

export const RATE_LIMIT_CONFIG = {
  /*
    Config Tips:
    1. Fixed Window Counter
    2. Sliding Window Log
    3. Sliding Window Counter
    4. Token Bucket
    5. Leaky Bucket
    
    these all algortihms needs these fields:
    {
      algorithm: "algoName", // name of algorithm(field name) from stratergies 
      limit: n, // ex. 5 or any +ve int value
      window: m, // in seconds (ex. 60)
    }


    Note:
    1. for tokenBucket algorithm we need to pass this extra field:
    refillRate: n/60; (ex. n tokens / minute) or (refillRate: n // here token will be filled at a speed of n token/sec).
    2. for leakyBucket algorithm we need to pass this extra field:
    leakRate: n/60; (ex. leaking n request/minute) or (leakRate: n // here requests will leak at speed of n requests/sec)
  */

  default: {
    algorithm: "leakyBucket",
    limit: 5,
    window: 60, // seconds
    refillRate: 5 / 60, // fill 5 tokens/minute
    leakRate: 5 / 60, // leak 5 request/minute from bucket
  },

  routes: {
    "/api/users": {
      algorithm: "fixed",
      limit: 2,
      window: 60,
      refillRate: 5 / 60,
      leakRate: 5 / 60,
    },

    "/api/orders": {
      algorithm: "tokenBucket",
      limit: 2,
      window: 60,
      refillRate: 6 / 60,
      leakRate: 5 / 60,
    },
  },
};

export default redis;
