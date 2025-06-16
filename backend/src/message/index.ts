import { AppDataSource } from "@config/data-source";
import { Message } from "./message.entity";
import { MessageService } from "./message.service";

export * from "./message.entity";
export * from "./message-input.dto";

export const commentRepository = AppDataSource.getRepository(Message);
export const commentService = new MessageService();
