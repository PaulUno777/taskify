
import { userRepository } from "src/user";
import { ForbiddenError, NotFoundError } from "@shared/errors";
import { AppDataSource } from "@config/data-source";
import { TaskComment } from "./task-comment.entity";
import { Task } from "../task.entity";

export class CommentService {
  private commentRepo = AppDataSource.getRepository(TaskComment);
  private taskRepo = AppDataSource.getRepository(Task);
  private userRepo = userRepository;

  async create(taskId: string, userId: string, content: string) {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ["owner", "sharedWith"],
    });

    if (!task) throw new NotFoundError("Task not found");
    if (
      task.owner.id !== userId &&
      !task.sharedWith.some((u) => u.id === userId)
    ) {
      throw new ForbiddenError("Forbidden");
    }
    const author = await this.userRepo.findOne({ where: { id: userId } });

    const comment = this.commentRepo.create({
      content,
      task: { id: task.id },
      author: { id: author?.id },
    });
    return this.commentRepo.save(comment);
  }

  async findAllForTask(taskId: string, userId: string) {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ["owner", "sharedWith"],
    });

    if (!task) throw new NotFoundError("Task not found");
    if (
      task.owner.id !== userId &&
      !task.sharedWith.some((u) => u.id === userId)
    ) {
      throw new ForbiddenError("Forbidden");
    }
    return this.commentRepo.find({
      where: { task: { id: taskId } },
      relations: ["author"],
    });
  }

  async delete(id: string, userId: string) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ["author"],
    });

    if (!comment) throw new NotFoundError("Not found");
    if (comment.author.id !== userId) throw new ForbiddenError("Forbidden");

    return this.commentRepo.remove(comment);
  }
}
