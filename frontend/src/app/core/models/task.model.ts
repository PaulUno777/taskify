import { Category } from './category.model';
import { Message } from './message.model';
import { PaginatedResponse } from './pagination.model';
import { Priority } from './priority.enum';
import { User } from './user.model';

export interface Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  priority: Priority;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  owner?: User;
  category: Category | null;
  shares: { user: User }[];
  comments: Message[];
}

export interface CreateTaskDto {
  title: string;
  description: string;
  priority?: Priority;
  dueDate?: string | null;
  categoryId?: string | null;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: string ;
  isCompleted?: boolean;
  categoryId?: string;
}

export interface TasksResponse extends PaginatedResponse<Task> {}
