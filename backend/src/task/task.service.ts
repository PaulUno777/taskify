import { userRepository } from "src/user";
import { ForbiddenError, NotFoundError } from "@shared/errors";
import {
  CreateTaskDto,
  FindAllForUserDto,
  UpdateTaskDto,
} from "./task-input.dto";
import { categoryRepository } from "src/category";
import { Task, taskRepository } from ".";
import { StandardOutputDto } from "@shared/dtos/standard-output.dto";

export class TaskService {
  private categoryRepo = categoryRepository;
  private taskRepo = taskRepository;
  private userRepo = userRepository;

  async create(
    data: CreateTaskDto,
    ownerId: string
  ): Promise<StandardOutputDto> {
    const owner = await this.userRepo.findOne({ where: { id: ownerId } });
    if (!owner) throw new NotFoundError("Owner not found");

    let task: Task;
    if (data.categoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: data.categoryId, user: { id: ownerId } },
      });
      if (!category) {
        throw new NotFoundError("Category not found or not owned by you");
      }
      delete data.categoryId;

      task = await this.taskRepo.save(
        this.taskRepo.create({ ...data, owner, category }),
        { reload: false }
      );
    } else {
      task = await this.taskRepo.save(this.taskRepo.create({ ...data, owner }));
    }

    return { message: "Task successfully created." };
  }

  async findAllForUser(
    userId: string,
    {
      page = 1,
      limit = 10,
      sortBy = "updatedAt",
      sortDirection = "DESC",
      priority,
      categoryId,
      isCompleted,
      dueFrom,
      dueTo,
      createdFrom,
      createdTo,
      updatedFrom,
      updatedTo,
    }: FindAllForUserDto
  ) {
    console.log("userId", userId);
    const query = this.taskRepo
      .createQueryBuilder("task")
      .innerJoin("task.owner", "owner")
      .leftJoinAndSelect("task.category", "category")
      .leftJoin("task.sharedWith", "sharedWith")
      .where("owner.id = :userId OR sharedWith.id = :userId", { userId });

    if (priority) {
      query.andWhere("task.priority = :priority", { priority });
    }

    if (categoryId) {
      query.andWhere("category.id = :categoryId", { categoryId });
    }

    if (isCompleted !== undefined) {
      query.andWhere("task.isCompleted = :isCompleted", { isCompleted });
    }

    if (dueFrom && dueTo) {
      query.andWhere("task.dueDate BETWEEN :dueFrom AND :dueTo", {
        dueFrom,
        dueTo,
      });
    }

    if (createdFrom && createdTo) {
      query.andWhere("task.createdAt BETWEEN :createdFrom AND :createdTo", {
        createdFrom,
        createdTo,
      });
    }

    if (updatedFrom && updatedTo) {
      query.andWhere("task.updatedAt BETWEEN :updatedFrom AND :updatedTo", {
        updatedFrom,
        updatedTo,
      });
    }

    query.orderBy(`task.${sortBy}`, sortDirection);

    query.skip((page - 1) * limit);
    query.take(limit);

    const [total, tasks] = await Promise.all([
      query.getCount(),
      query.getMany(),
    ]);

    // Format the result to return metadata alongside
    return {
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: tasks,
    };
  }

  async findOne(id: string, userId: string) {
    const task = await this.taskRepo
      .createQueryBuilder("task")
      .innerJoin("task.owner", "owner")
      .addSelect([
        "owner.id",
        "owner.email",
        "owner.firstName",
        "owner.lastName",
      ])
      .leftJoinAndSelect("task.sharedWith", "sharedWith")
      .leftJoinAndSelect("task.category", "category")
      .leftJoinAndSelect("task.comments", "comments")
      .where(
        "task.id = :id AND (owner.id = :userId OR sharedWith.id = :userId)",
        { id, userId }
      )
      .getOne();

    if (!task) throw new NotFoundError("Task not found");
    if (
      task.owner.id !== userId &&
      !task.sharedWith.some((u) => u.id === userId)
    ) {
      throw new ForbiddenError("Forbidden");
    }
    return task;
  }

  async update(
    id: string,
    userId: string,
    data: UpdateTaskDto
  ): Promise<StandardOutputDto> {
    const task = await this.findOne(id, userId);
    if (data.categoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: data.categoryId, user: { id: userId } },
      });
      if (!category) {
        throw new NotFoundError("Category not found or not owned by you");
      }
      task.category = category;
      delete data.categoryId;
    }
    Object.assign(task, data);
    return { message: "Task successfully updated." };
  }

  async delete(id: string, userId: string): Promise<StandardOutputDto> {
    const task = await this.findOne(id, userId);

    await this.taskRepo.remove(task);

    return { message: "Task successfully removed." };
  }

  async share(
    id: string,
    ownerId: string,
    friendId: string
  ): Promise<StandardOutputDto> {
    const task = await this.findOne(id, ownerId);

    const friend = await this.userRepo.findOne({ where: { id: friendId } });
    if (!friend) throw new NotFoundError("User not found");

    task.sharedWith = task.sharedWith ? [...task.sharedWith, friend] : [friend];
    await this.taskRepo.save(task);

    return { message: "Task successfully shared." };
  }
}
