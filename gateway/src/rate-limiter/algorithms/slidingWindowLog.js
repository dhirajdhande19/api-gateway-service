import redis from "../config.js";

export const slidingWindowLog = async (req, routeConfig) => {
  try {
    console.log("Algorithm: Sliding Window Log");
    const key = req.user?._id
      ? `key:api-${req.originalUrl}:algo-${routeConfig.algorithm}:userId-${req.user._id}`
      : `key:api-${req.originalUrl}:algo-${routeConfig.algorithm}:ip-${req.ip}`;

    const now = Date.now();
    const windowMs = routeConfig.window * 1000; //  convert to miliseconds
    // add curr req timestamaps to this key
    await redis.zadd(key, now, now.toString());
    // remove expired one's
    await redis.zremrangebyscore(key, 0, now - windowMs);
    // count and verify if it this req should be allowed or not
    const count = await redis.zcount(key, now - windowMs, now);

    console.log(`req count: ${count}`);
    if (count > routeConfig.limit) {
      console.log("failure reason: req limit exceeded");
      return false;
    } // do not allow req to pass

    console.log(`status: success`);
    return true; // allow req to pass through
  } catch (e) {
    console.log(`status: fail\nError occured from redis: ${e.message}`);
    return true; // let requests pass
  }
};
