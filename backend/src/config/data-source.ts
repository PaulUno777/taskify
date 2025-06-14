import { DataSource } from "typeorm";
import { config } from "./config";
import { User } from "../user/user.entity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./db.sqlite",
  synchronize: config.nodeEnv == "development",
  logging: config.nodeEnv == "development",
  entities: [User],
});
