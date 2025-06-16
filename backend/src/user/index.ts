import { AppDataSource } from "@config/data-source";
import { UserService } from "./user.service";
import { User } from "./user.entity";

export * from "./user.entity";
export * from "./user.mapper";
export * from "./user-input.dto";
export * from "./user-output.dto";
export * from "./user.service";

export const userRepository = AppDataSource.getRepository(User);
export const userService = new UserService();
