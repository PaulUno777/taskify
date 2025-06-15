import { taskRepository } from "src/task";
import { CreateCommentDto, Comment, commentRepository } from ".";
import { NotFoundError, ForbiddenError } from "@shared/errors";
import { userRepository } from "src/user";
import { StandardOutputDto } from "@shared/dtos/standard-output.dto";

export class CommentService {
  private commentRepo = commentRepository;
  private taskRepo = taskRepository;
  private userRepo = userRepository;

  async create({
    content,
    taskId,
    authorId,
  }: CreateCommentDto): Promise<StandardOutputDto> {
    const task = await this.taskRepo.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundError("Task not found.");

    const author = await this.userRepo.findOne({ where: { id: authorId } });
    if (!author) throw new NotFoundError("Author not found.");

    await this.commentRepo.save(
      this.commentRepo.create({ content, task, author })
    );

    return { message: "Comment successfully created." };
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentRepo.findOne({ where: { id } });

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
    const updated = await this.commentRepo.save(comment);
    return { message: "Comment successfully updated.", data: updated };
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
