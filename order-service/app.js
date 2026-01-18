import e from "express";
const app = e();
const PORT = 4002;

import orderRoutes from "./orders.routes.js";

app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server running on: ${PORT}`);
});
