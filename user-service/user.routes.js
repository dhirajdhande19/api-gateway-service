import Router from "express";
import { getAllUsers, getUser } from "./user.controller.js";
const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUser);

export default router;
