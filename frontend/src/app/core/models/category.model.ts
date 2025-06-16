import { Task } from './task.model';

export interface Category {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
}

export interface CreateCategoryDto {
  name: string;
  color: string;
}
