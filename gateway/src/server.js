import app from "./app.js";
const server = app;
import { PORT } from "./config/env.js";

server.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});
