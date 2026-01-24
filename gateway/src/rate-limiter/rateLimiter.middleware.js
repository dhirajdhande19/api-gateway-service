import { RATE_LIMIT_CONFIG, stratergies } from "./config.js";

export const rateLimiter = async (req, res, next) => {
  try {
    console.log(`-----Rate Limit Check Start-----\nroute: ${req.originalUrl}`);

    console.log(
      req.user?._id ? `userId: ${req.user._id}` : `public ip: ${req.ip}`,
    );

    const routeConfig =
      RATE_LIMIT_CONFIG.routes[req.baseUrl] || RATE_LIMIT_CONFIG.default; // fallback to default

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

    console.log("-----Rate Limit Pass-----\n");
    next();
  } catch (e) {
    console.log("status: fail");
    console.log(`failure reason: ${e.message}\n-----Rate Limit Fail-----\n`);
    next();
  }
};
