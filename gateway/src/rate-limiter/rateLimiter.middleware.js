import { RATE_LIMIT_CONFIG, stratergies } from "./config.js";

export const rateLimiter = async (req, res, next) => {
  console.log(`-----Rate Limit Check Start-----\nroute: ${req.originalUrl}`);

  const routeConfig =
    RATE_LIMIT_CONFIG.routes[req.route?.path] || RATE_LIMIT_CONFIG.default; // fallback to default

  const limiter = stratergies[routeConfig.algorithm];

  if (!limiter) {
    return next(); // fail open
    // i.e. let requests pass if there's a bug in limiter itself
    // even if service might get overwhelmed the service stays
    // aviailable rather than blocking everyone.
  }

  const isAllowed = await limiter(req, routeConfig);

  if (!isAllowed) {
    console.log("status: fail\n-----Rate Limit Fail-----\n");
    return res.status(429).json({ message: "Too Many Requests" });
  }
  console.log("status: success\n-----Rate Limit Pass-----\n");
  next();
};

/*
    Rate Limiting Algorithms.
    1. Fixed Window Counter
    2. Sliding Window Log
    3. Sliding Window Counter
    4. Token Bucket
    5. Leaky Bucket
*/
