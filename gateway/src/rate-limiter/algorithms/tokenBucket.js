import redis from "../config.js";

// Token Bucket Algorithm
export const tokenBucket = async (req, routeConfig) => {
  try {
    console.log("Algorithm: Token Bucket");
    const key = req.user?._id
      ? `key:api-${req.originalUrl}:algo-${routeConfig.algorithm}:userId-${req.user._id}`
      : `key:api-${req.originalUrl}:algo-${routeConfig.algorithm}:ip-${req.ip}`;

    const capacity = routeConfig.limit; // max tokens
    const refillRate = routeConfig.refillRate; // tokens per second
    const now = Date.now();

    const tokensStr = await redis.hget(key, "tokens"); // get leftover tokens from redis
    const lastRefillStr = await redis.hget(key, "lastRefill"); // retrive last time token was filled

    let tokens = tokensStr ? Number(tokensStr) : capacity;
    let lastRefill = lastRefillStr ? Number(lastRefillStr) : now;

    const elapsedSeconds = (now - lastRefill) / 1000; // how many seconds have passed since the last refil
    const refillTokens = Math.floor(elapsedSeconds * refillRate); // how many token needs to be filled in bucket

    if (refillTokens > 0) {
      tokens = Math.min(capacity, tokens + refillTokens); // prevents bucket from overflowing
      lastRefill = now;
    }

    if (tokens <= 0) {
      console.log("failure reason: not enough tokens in the bucket");
      return false;
    }

    tokens -= 1;

    // save state to redis
    await redis.hset(key, { tokens, lastRefill });

    // optional cleanup
    await redis.expire(key, routeConfig.window * 2);

    console.log(`consumed: 1 token\nleft token: ${tokens}\nstatus: success`);

    return true;
  } catch (e) {
    console.log(`status: fail\nfailure reason:  ${e.message}`);
    return true; // let requests pass
  }
};
