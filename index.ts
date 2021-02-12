import app, { createServer } from "./src/app";

const server = createServer(app);

server.listen(3000, () => {
  console.log("Server listens at ::3000");
});
