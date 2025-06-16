import { AppDataSource } from "@config/data-source";
import { Task } from "./task.entity";
import { TaskService } from "./task.service";

export * from "./task.entity";
export * from "./task-input.dto";

export const taskRepository = AppDataSource.getRepository(Task);
export const taskService = new TaskService();
