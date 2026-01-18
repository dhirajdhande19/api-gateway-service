import e from "express";
const app = e();

import userRoutes from "./modules/users/users.routes.js";
import orderRoutes from "./modules/orders/orders.routes.js";

app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

export default app;
