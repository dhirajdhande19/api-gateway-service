import e from "express";
const app = e();

import userRoutes from "./modules/users/users.routes.js";
import orderRoutes from "./modules/orders/orders.routes.js";
import productRoutes from "./modules/products/products.routes.js";

app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);

app.get("/ping", (req, res) => {
  return res.status(200).json("pong");
});

export default app;
