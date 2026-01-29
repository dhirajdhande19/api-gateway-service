import redis from "../config.js";

// Leaky Bucket Algorithm
export const leakyBucket = async (req, routeConfig) => {
  try {
    console.log("Algorithm: Leaky Bucket");
    const key = req.user?._id
      ? `key:api-${req.originalUrl}:algo-${routeConfig.algorithm}:userId-${req.user._id}`
      : `key:api-${req.originalUrl}:algo-${routeConfig.algorithm}:ip-${req.ip}`;

    const capacity = routeConfig.limit; // max size of our bucket
    const leakRate = routeConfig.leakRate; // at what rate requests should leak from bucket? (per second)

    const now = Date.now();
    // get string values from redis if they exist or null
    const bucketSizeStr = await redis.hget(key, "bucketSize");
    const lastLeakTimeStr = await redis.hget(key, "lastLeakTime");

    // convert them to number (if value exist) or fallback to default
    let bucketSize = bucketSizeStr ? Number(bucketSizeStr) : 0;
    let lastLeakTime = lastLeakTimeStr ? Number(lastLeakTimeStr) : now;

    const elapsedSeconds = (now - lastLeakTime) / 1000; // how much time have passed since last leak (in seconds)
    const leaked = elapsedSeconds * leakRate; // how much requests have been leaked from bucket

    const currBucketSize = Math.max(0, bucketSize - leaked);

    console.log(
      `bucketSize if the curr req passes: ${currBucketSize + 1}\nbucketCapacity: ${capacity}`,
    );

    if (currBucketSize + 1 > capacity) {
      console.log("failure reason: bucket size is full");
      return false;
    }

    bucketSize = currBucketSize + 1;
    lastLeakTime = now;

    // set updated values in redis
    await redis.hset(key, { bucketSize, lastLeakTime });

    // optional cleanup so key's don't exist in redis forever
    await redis.expire(key, routeConfig.window * 2);

    console.log("status: success");

    return true;
  } catch (e) {
    console.error(`status: fail\nfailure reason:  ${e.message}`);
    return true; // let requests pass
  }
};
