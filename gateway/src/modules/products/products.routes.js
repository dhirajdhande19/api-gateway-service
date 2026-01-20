import Router from "express";
import { forwardToProductService } from "./products.controller.js";
import { rateLimiter } from "../../rate-limiter/rateLimiter.middleware.js";
const router = Router();

router.all(/.*/, rateLimiter, forwardToProductService);

export default router;
