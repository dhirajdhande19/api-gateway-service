import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export const authMiddleware = async (req, res, next) => {
  try {
    console.log("-----Auth Check Start-----");
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      console.log(
        "status : Fail\nfailure reason: No token provided\n-----Auth Check Fail-----\n",
      );
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = jwt.verify(token, JWT_SECRET);

    // logging
    console.log(`route: ${req.originalUrl}`);
    if (user._id) {
      console.log(`userId: ${user._id}`);
    }
    console.log("status : success\n-----Auth Check Success-----\n");

    // set decoded/verfied user to req.user so services can access them easily
    req.user = user;
    next();
  } catch (e) {
    console.error({
      message: "Error occured while validating auth token",
      details: e.message,
    });
    console.error("status : fail\n-----Auth Check Fail-----\n");
    return res.status(401).json({ message: "Unauthorized" });
  }
};
