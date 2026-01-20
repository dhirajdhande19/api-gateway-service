import e from "express";
const app = e();
const PORT = 4003;

import productRoutes from "./products.routes.js";

app.use("/api/products", productRoutes);

app.listen(PORT, () => {
  console.log(`Server running on: ${PORT}`);
});
