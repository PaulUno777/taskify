import { taskService } from "src/task";
import { CreateMessageDto, Message, commentRepository } from ".";
import { NotFoundError, ForbiddenError } from "@shared/errors";
import { userService } from "src/user";
import { StandardOutputDto } from "@shared/dtos/standard-output.dto";

export class MessageService {
  private commentRepo = commentRepository;

  async create({
    content,
    taskId,
    authorId,
  }: CreateMessageDto): Promise<Message> {
    const task = await taskService.findOne(taskId, authorId);
    if (!task) throw new NotFoundError("Task not found.");

    const author = await userService.findOne(authorId);
    if (!author) throw new NotFoundError("Author not found.");

    const message = await this.commentRepo.save(
      this.commentRepo.create({ content, task, author })
    );
    return this.findOne(message.id);
  }

  async findOne(id: string): Promise<Message> {
    const comment = await this.commentRepo
      .createQueryBuilder("comment")
      .innerJoin("comment.author", "author")
      .addSelect([
        "author.id",
        "author.email",
        "author.firstName",
        "author.lastName",
      ])
      .andWhere("comment.id = :id", { id })
      .getOne();

    if (!comment) throw new NotFoundError("Comment not found.");
    return comment;
  }

  async findAllForTask(taskId: string): Promise<Message[]> {
    const comment = await this.commentRepo
      .createQueryBuilder("comment")
      .innerJoin("comment.author", "author")
      .addSelect([
        "author.id",
        "author.email",
        "author.firstName",
        "author.lastName",
      ])
      .leftJoin("comment.task", "task")
      .andWhere("task.id = :taskId", { taskId })
      .getMany();

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
