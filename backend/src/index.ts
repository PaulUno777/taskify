import "reflect-metadata";
import http from 'http';
import app from "./app";
import { config } from "@config/config";
import { AppDataSource } from "@config/data-source";
import { setupWebSocketServer } from "./websocket/websocket.server";

async function main() {
  const server = http.createServer(app);
  try {
    AppDataSource.initialize()
      .then(() => {
        console.log("DataBase initialized\n");

        setupWebSocketServer(server);

        server.listen(config.port, () => {
          console.log(
            `Server running on port ${config.port} in ${config.nodeEnv} mode.`
          );
          console.log(
            `WebSocket running on  ws://localhost:${config.port}/ws`
          );
        });
      })
      .catch((err) => console.error(err));
  } catch (err) {
    console.error("Startup Error!", err);
    process.exit(1);
  }
}
main();
