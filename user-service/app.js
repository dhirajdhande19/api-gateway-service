import e from "express";
const app = e();
import { USERS_SERVICE_PORT } from "./env.js";

import userRoutes from "./user.routes.js";

app.use("/api/users", userRoutes);

app.listen(USERS_SERVICE_PORT, () => {
  console.log(`Server running on: ${USERS_SERVICE_PORT}`);
});
