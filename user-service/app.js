import e from "express";
const app = e();
import { PORT } from "./env.js";

import userRoutes from "./user.routes.js";

app.use("/api/users", userRoutes);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on: ${PORT}`);
});
