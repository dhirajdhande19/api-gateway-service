import redis from "../config.js";

// Fixed Window Counter Algorithm
export const fixedWindowCounter = async (req, routeConfig) => {
  try {
    console.log("Algorithm: Fixed Window Counter");
    const key = req.user?._id
      ? `key:api-${req.originalUrl}:algo-${routeConfig.algorithm}:userId-${req.user._id}`
      : `key:api-${req.originalUrl}:algo-${routeConfig.algorithm}:ip-${req.ip}`;

    let count = await redis.incr(key);

    console.log(`req count: ${count}`);

    if (count == 1) {
      await redis.expire(key, routeConfig.window);
    }

    if (count > routeConfig.limit) {
      console.log("failure reason: req limit exceeded");
      return false;
    }

    console.log(`status: success`);
    return true;
  } catch (e) {
    console.log(`status: fail\nError occured from redis: ${e.message}`);
    return true; // let requests pass
  }
};
