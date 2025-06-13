import { DataSource } from "typeorm";
import { config } from "../shared/config";

export const AppDataSource = new DataSource({  
  type: "sqlite",
  database: "./db.sqlite",
  synchronize: true,
  logging: config.nodeEnv == "development",
  entities: [],
});