import { DataSource } from "typeorm";
import { config } from "./config";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./db.sqlite",
  synchronize: config.nodeEnv == "development",
  logging: config.nodeEnv == "development",
  entities: ['src/**/*.entity.ts'],
});
