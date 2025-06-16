import "reflect-metadata";
import app from "./app";
import { config } from "@config/config";
import { AppDataSource } from "@config/data-source";

async function main() {
  try {
    AppDataSource.initialize()
      .then(() => {
        console.log("= = = Data Source initialized = = =\n");

        app.listen(config.port, () => {
          console.log(
            `Server started on port ${config.port} in ${config.nodeEnv} mode.`
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
