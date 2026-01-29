import e from "express";
const app = e();
import { ORDERS_SERVICE_PORT } from "./env.js";

import orderRoutes from "./orders.routes.js";

app.use("/api/orders", orderRoutes);

app.listen(ORDERS_SERVICE_PORT, () => {
  console.log(`Server running on: ${ORDERS_SERVICE_PORT}`);
});
