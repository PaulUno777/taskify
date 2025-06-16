import { taskService } from "src/task";
import { CreateCommentDto, Comment, commentRepository } from ".";
import { NotFoundError, ForbiddenError } from "@shared/errors";
import { userService } from "src/user";
import { StandardOutputDto } from "@shared/dtos/standard-output.dto";

export class CommentService {
  private commentRepo = commentRepository;

  async create({
    content,
    taskId,
    authorId,
  }: CreateCommentDto): Promise<StandardOutputDto> {
    const task = await taskService.findOne(taskId, authorId);
    if (!task) throw new NotFoundError("Task not found.");

    const author = await userService.findOne(authorId);
    if (!author) throw new NotFoundError("Author not found.");

    await this.commentRepo.save(
      this.commentRepo.create({ content, task, author })
    );

    return { message: "Comment successfully created." };
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepo.createQueryBuilder("comment")
    .innerJoin("comment.author", "author")
    .addSelect([
      "author.id",
      "author.email",
      "author.firstName",
      "author.lastName",
    ]).getOne();

    if (!comment) throw new NotFoundError("Comment not found.");
    return comment;
  }

  async update(
    id: string,
    authorId: string,
    content: string
  ): Promise<StandardOutputDto> {
    const comment = await this.commentRepo.findOne({ where: { id } });

    if (!comment) throw new NotFoundError("Comment not found.");
    if (comment.author.id !== authorId)
      throw new ForbiddenError("Not authorized.");

    comment.content = content;
    await this.commentRepo.save(comment);
    return { message: "Comment successfully updated." };
  }

  async delete(id: string, authorId: string): Promise<StandardOutputDto> {
    const comment = await this.commentRepo.findOne({ where: { id } });

    if (!comment) throw new NotFoundError("Comment not found.");
    if (comment.author.id !== authorId)
      throw new ForbiddenError("Not authorized.");

    await this.commentRepo.remove(comment);
    return { message: "Comment successfully removed." };
  }
}
