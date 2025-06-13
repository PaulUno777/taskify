import "reflect-metadata";
import app from "./app";
import { config } from "./shared/config";
import { AppDataSource } from "./shared/data/data-source";

// Init typeorm before start server
AppDataSource.initialize()
  .then(() => {
    app.listen(config.port, () => {
      console.log(
        `Server started on port ${config.port} in ${config.nodeEnv} mode.`
      );
    });
  })
  .catch((err) => console.error(err));
