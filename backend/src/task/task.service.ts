import { userRepository } from "src/user";
import { ForbiddenError, NotFoundError } from "@shared/errors";
import {
  CreateTaskDto,
  FindAllForUserDto,
  UpdateTaskDto,
} from "./task-input.dto";
import { categoryRepository } from "src/category";
import { SharePermission, Task, taskRepository, taskShareRepository } from ".";
import { StandardOutputDto } from "@shared/dtos/standard-output.dto";

export class TaskService {
  private categoryRepo = categoryRepository;
  private taskShareRepo = taskShareRepository;
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
    const query = this.taskRepo
      .createQueryBuilder("task")
      .innerJoin("task.owner", "owner")
      .leftJoinAndSelect("task.category", "category")
      .leftJoin("task.shares", "shares")
      .leftJoin("shares.user", "sharedWith")
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
      .leftJoinAndSelect("task.shares", "shares")
      .leftJoin("shares.user", "sharedWith")
      .addSelect([
        "sharedWith.id",
        "sharedWith.email",
        "sharedWith.firstName",
        "sharedWith.lastName",
      ])  
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
      !task.shares.some((u) => u.user.id === userId)
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

    // Determine if the user is the owner or has EDIT permission
    const isOwner = task.owner.id === userId;
    const share = task.shares?.find((s) => s.user.id === userId);
    const canEdit =
      isOwner || (share && share.permission === SharePermission.EDIT);

    if (!canEdit) {
      throw new ForbiddenError("Forbidden. You do not have edit permissions.");
    }

    if (data.categoryId) {
      if (!isOwner)
        throw new ForbiddenError(
          "Forbidden. Only owner can modify the category."
        );
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
    await this.taskRepo.save(task);

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
    friendEmail: string,
    permission: SharePermission
  ): Promise<StandardOutputDto> {
    const task = await this.findOne(id, ownerId);

    const friend = await this.userRepo.findOne({
      where: { email: friendEmail },
    });
    if (!friend) throw new NotFoundError("User not found");

    let existing = await this.taskShareRepo.findOne({
      where: { task: { id: task.id }, user: { id: friend.id } },
    });

    if (existing?.permission) {
      existing.permission = permission;
      await this.taskShareRepo.save(existing);
    } else {
      await this.taskShareRepo.save(
        this.taskShareRepo.create({
          task,
          user: friend,
          permission,
        })
      );
    }

    return { message: "Task successfully shared." };
  }
}
