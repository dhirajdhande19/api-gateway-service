import app from "./app.js";
const server = app;
import { GATEWAY_PORT } from "./config/env.js";

server.listen(GATEWAY_PORT, () => {
  console.log(`Running on port: ${GATEWAY_PORT}`);
});
