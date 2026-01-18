import e from "express";
const app = e();
const PORT = 4001;

import userRoutes from "./user.routes.js";

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on: ${PORT}`);
});
