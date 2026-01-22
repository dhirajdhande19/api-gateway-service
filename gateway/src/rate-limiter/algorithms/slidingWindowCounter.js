import redis from "../config.js";

export const slidingWindowCounter = async (req, routeConfig) => {
  try {
    const now = Date.now();
    const windowSize = routeConfig.window * 1000; // convert to ms
    const currWindow = Math.floor(now / windowSize);
    const prevWindow = currWindow - 1;

    const baseKey = req.user?._id
      ? `key:api-${req.originalUrl}:algo-${routeConfig.algorithm}:userId-${req.user._id}`
      : `key:api-${req.originalUrl}:algo-${routeConfig.algorithm}:ip-${req.ip}`;

    const currwindowKey = `${baseKey}:window-${currWindow}`;
    const prevWindowKey = `${baseKey}:window-${prevWindow}`;

    // incr only curr window key
    const currCount = await redis.incr(currwindowKey);

    if (currCount == 1) {
      // set expiry for 1st new request in given window timeline
      await redis.expire(currwindowKey, routeConfig.window * 2);
    }

    const prevCount = (await redis.get(prevWindowKey)) || 0; // count could be null if no requests have
    // been made in prev window time so we fallback to 0

    const elapsed = now % windowSize;
    const weight = (windowSize - elapsed) / windowSize;

    const effectiveCount = currCount + prevCount * weight;
    console.log(
      `currCount: ${currCount}\nprevCount: ${prevCount}\neffectiveCount: ${effectiveCount}`,
    );

    if (effectiveCount > routeConfig.limit) {
      console.log("failure reason: req limit exceeded");
      return false;
    }

    console.log("status: success");
    return true;
  } catch (e) {
    console.log(`status: fail\nError occured from redis: ${e.message}`);
    return true; // let requests pass
  }
};
