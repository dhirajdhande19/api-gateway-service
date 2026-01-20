import Router from "express";
import { forwardToOrdersService } from "./orders.controller.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { rateLimiter } from "../../rate-limiter/rateLimiter.middleware.js";
const router = Router();

router.all(/.*/, authMiddleware, rateLimiter, forwardToOrdersService);

export default router;
