import e from "express";
const app = e();
import { PORT } from "./env.js";

import productRoutes from "./products.routes.js";

app.use("/api/products", productRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on: ${PORT}`);
});
