import Router from "express";
import { getAllOrders, getOrder } from "./orders.controller.js";
const router = Router();

router.get("/", getAllOrders);
router.get("/:id", getOrder);

export default router;
