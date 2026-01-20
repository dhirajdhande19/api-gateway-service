import Router from "express";
import { forwardToUserService } from "./users.controller.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { rateLimiter } from "../../rate-limiter/rateLimiter.middleware.js";
const router = Router();

router.all(/.*/, authMiddleware, rateLimiter, forwardToUserService);

export default router;
