import Router from "express";
import { forwardToUserService } from "./users.controller.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
const router = Router();

router.all(/.*/, authMiddleware, forwardToUserService);

export default router;
