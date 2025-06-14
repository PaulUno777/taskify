import { TaskService } from "./task.service";

export * from "./task.entity";
export * from "./task-input.dto";

export const taskService = new TaskService();
