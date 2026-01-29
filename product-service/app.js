import e from "express";
const app = e();
import { PRODUCTS_SERVICE_PORT } from "./env.js";

import productRoutes from "./products.routes.js";

app.use("/api/products", productRoutes);

app.listen(PRODUCTS_SERVICE_PORT, () => {
  console.log(`Server running on: ${PRODUCTS_SERVICE_PORT}`);
});
