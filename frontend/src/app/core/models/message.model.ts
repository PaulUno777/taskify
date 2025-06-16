import { User } from './user.model';

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: User;
}

export interface CreateMessageDto {
  content: string;
}
