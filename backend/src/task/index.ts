import { AppDataSource } from "@config/data-source";
import { Task } from "./task.entity";
import { TaskService } from "./task.service";
import { TaskShare } from "./task-share.entity";

export * from "./task.entity";
export * from "./task-share.entity";
export * from "./task-input.dto";

export const taskRepository = AppDataSource.getRepository(Task);
export const taskShareRepository = AppDataSource.getRepository(TaskShare);

export const taskService = new TaskService();
