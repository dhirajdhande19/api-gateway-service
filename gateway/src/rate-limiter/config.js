import Redis from "ioredis";
import { fixedWindowCounter } from "./algorithms/fixedWindow.js";
const redis = new Redis();

redis.on("error", (e) => {
  console.log({ message: "Error occured from redis", details: e.message });
});

export const stratergies = {
  fixed: fixedWindowCounter,
};

export const RATE_LIMIT_CONFIG = {
  default: {
    algorithm: "fixed", // fixed
    limit: 5,
    window: 60, // seconds
  },

  routes: {
    "/api/users": {
      algorithm: "fixed",
      limit: 5,
      window: 60,
    },

    "/api/orders": {
      algorithm: "fixed",
      limit: 10,
      window: 60,
    },
  },
};

export default redis;
