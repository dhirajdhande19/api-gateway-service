import Router from "express";
import { getAllProdcuts, getProduct } from "./products.controller.js";
const router = Router();

router.get("/", getAllProdcuts);
router.get("/:id", getProduct);

export default router;
