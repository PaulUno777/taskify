import "reflect-metadata";
import app from "./app";
import { config } from "@config/config";
import { AppDataSource } from "@config/data-source";

// Init typeorm before start server
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source initialized");
    app.listen(config.port, () => {
      console.log(
        `Server started on port ${config.port} in ${config.nodeEnv} mode.`
      );
    });
  })
  .catch((err) => console.error(err));
