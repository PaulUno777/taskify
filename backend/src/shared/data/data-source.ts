import { DataSource } from "typeorm";
import { config } from "../config";
import { User } from "../../auth/user.entity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./db.sqlite",
  synchronize: true,
  logging: config.nodeEnv == "development",
  entities: [User],
});
