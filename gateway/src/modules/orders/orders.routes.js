import Router from "express";
import { forwardToOrdersService } from "./orders.controller.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
const router = Router();

router.all(/.*/, authMiddleware, forwardToOrdersService);

export default router;
