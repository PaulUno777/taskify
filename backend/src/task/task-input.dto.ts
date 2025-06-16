import { Priority } from "./task.entity";

export class CreateTaskDto {
  title: string;
  description: string;
  priority?: Priority;
  dueDate?: Date;
  categoryId?: string;
}

export class UpdateTaskDto {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  priority?: Priority;
  dueDate?: Date;
  categoryId?: string;
}

export class FindAllForUserDto {
  page?: number;
  limit?: number;
  sortBy?: "isCompleted" | "dueDate" | "updatedAt" | "createdAt";
  sortDirection?: "ASC" | "DESC";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  categoryId?: number;
  isCompleted?: boolean;
  dueFrom?: Date;
  dueTo?: Date;
  createdFrom?: Date;
  createdTo?: Date;
  updatedFrom?: Date;
  updatedTo?: Date;
}
