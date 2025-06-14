import { userRepository } from "src/user";
import { ForbiddenError, NotFoundError } from "@shared/errors";
import { AppDataSource } from "@config/data-source";
import { Task } from "./task.entity";
import {
  CreateTaskDto,
  FindAllForUserDto,
  UpdateTaskDto,
} from "./task-input.dto";
import { TaskCategory } from "../task-category";

export class TaskService {
  private categoryRepo = AppDataSource.getRepository(TaskCategory);
  private taskRepo = AppDataSource.getRepository(Task);
  private userRepo = userRepository;

  async create(data: CreateTaskDto, ownerId: string) {
    const owner = await this.userRepo.findOne({ where: { id: ownerId } });
    if (!owner) throw new NotFoundError("Owner not found");
    if (data.categoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: data.categoryId, user: { id: ownerId } },
      });

      if (!category) {
        throw new NotFoundError("Category not found or not owned by you");
      }
      delete data.categoryId;
      const task = this.taskRepo.create({ ...data, owner, category });
      return this.taskRepo.save(task);
    }

    const task = this.taskRepo.create({ ...data, owner });
    return this.taskRepo.save(task);
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
    .createQueryBuilder('task')
    .innerJoin('task.owner', 'owner')
    .addSelect(['owner.id', 'owner.email', 'owner.firstName', 'owner.lastName'])
    .leftJoinAndSelect('task.sharedWith', 'sharedWith')
    .leftJoinAndSelect('task.category', 'category')
    .leftJoinAndSelect('task.comments', 'comments')
    .where('task.id = :id AND (owner.id = :userId OR sharedWith.id = :userId)', { id, userId })
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

  async update(id: string, userId: string, data: UpdateTaskDto) {
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
    return this.taskRepo.save(task);
  }

  async delete(id: string, userId: string) {
    const task = await this.findOne(id, userId);
    return this.taskRepo.remove(task);
  }

  async share(id: string, ownerId: string, friendId: string) {
    const task = await this.findOne(id, ownerId);
    const friend = await this.userRepo.findOne({ where: { id: friendId } });

    if (!friend) throw new NotFoundError("User not found");

    task.sharedWith = task.sharedWith ? [...task.sharedWith, friend] : [friend];
    return this.taskRepo.save(task);
  }
}
