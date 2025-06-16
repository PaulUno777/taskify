import { AppDataSource } from "@config/data-source";
import { Comment } from "./comment.entity";
import { CommentService } from "./comment.service";

export * from "./comment.entity";
export * from "./comment-input.dto";

export const commentRepository = AppDataSource.getRepository(Comment);
export const commentService = new CommentService();
