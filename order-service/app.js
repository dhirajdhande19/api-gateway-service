import e from "express";
const app = e();
import { PORT } from "./env.js";

import orderRoutes from "./orders.routes.js";

app.use("/api/orders", orderRoutes);

app.get("/ping", (req, res) => {
  return res.status(200).json({ status: "Ok" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on: ${PORT}`);
});
