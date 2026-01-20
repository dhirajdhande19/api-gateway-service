import redis from "../config.js";

// Fixed Window Counter Algorithm
export const fixedWindowCounter = async (req, routeConfig) => {
  if (req.user?._id) {
    // for authenticated routes use userId as uniqueness factor
    const key = `key:algo-${routeConfig.algorithm}:userId-${req.user._id}`;

    let count = await redis.incr(key);

    console.log(`req count: ${count}\nuserId: ${req.user._id}`);

    if (count == 1) {
      await redis.expire(key, routeConfig.window);
    }

    if (count > routeConfig.limit) {
      console.log("failure reason: req limit exceeded");
      return false;
    }
  } else {
    // for non-authenticated routes use public-ip as uniqueness factor
    const key = `key:algo-${routeConfig.algorithm}:ip-${req.ip}`;

    let count = await redis.incr(key);

    console.log(`req count: ${count}\npublic ip: ${req.ip}`);

    if (count == 1) {
      await redis.expire(key, routeConfig.window);
    }

    if (count > routeConfig.limit) {
      console.log("failure reason: req limit exceeded");
      return false;
    }
  }

  return true;
};
