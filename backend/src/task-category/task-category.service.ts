import { AppDataSource } from "@config/data-source";
import { TaskCategory } from "./task-category.entity";
import { userRepository } from "src/user";
import { NotFoundError } from "@shared/errors";

export class CategoryService {
  private categoryRepo = AppDataSource.getRepository(TaskCategory);
  private userRepo = userRepository;

  async create(data: Partial<TaskCategory>, userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundError("User not found");

    const category = this.categoryRepo.create({ ...data, user });
    return this.categoryRepo.save(category);
  }

  async findAll(userId: string) {
    return this.categoryRepo.find({ where: { user: { id: userId } } });
  }

  async findOne(id: string, userId: string) {
    const category = await this.categoryRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!category) throw new NotFoundError("Not found");
    return category;
  }

  async update(id: string, userId: string, data: Partial<TaskCategory>) {
    const category = await this.findOne(id, userId);
    Object.assign(category, data);
    return this.categoryRepo.save(category);
  }

  async delete(id: string, userId: string) {
    const category = await this.findOne(id, userId);
    return this.categoryRepo.remove(category);
  }
}
