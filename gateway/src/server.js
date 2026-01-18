import app from "./app.js";
const server = app;
const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});
