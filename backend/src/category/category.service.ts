import { userRepository } from "src/user";
import { ConflictError, NotFoundError } from "@shared/errors";
import { categoryRepository, CreateCategoryDto, UpdateCategoryDto } from ".";

export class CategoryService {
  private categoryRepo = categoryRepository;
  private userRepo = userRepository;

  async create(data: CreateCategoryDto, userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundError("User not found");

    const existing = await this.categoryRepo.findOne({
      where: { name: data.name },
    });
    if (existing) {
      existing.color = data.color;
      await this.categoryRepo.save(existing);

      return { message: "Category successfully updated." };
    }
    await this.categoryRepo.save(this.categoryRepo.create({ ...data, user }));
    return { message: "Category successfully created." };
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

  async update(id: string, userId: string, data: UpdateCategoryDto) {
    const category = await this.findOne(id, userId);
    Object.assign(category, data);
    return this.categoryRepo.save(category);
  }

  async delete(id: string, userId: string) {
    const category = await this.findOne(id, userId);
    return this.categoryRepo.remove(category);
  }
}
