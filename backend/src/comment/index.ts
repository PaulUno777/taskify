import { AppDataSource } from "@config/data-source";
import { Comment } from "./task-comment.entity";
import { CommentService } from "./task-comment.service";

export * from "./task-comment.entity";
export * from "./task-comment-input.dto";

export const commentRepository = AppDataSource.getRepository(Comment);
export const commentService = new CommentService();
