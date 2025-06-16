import { AppDataSource } from "@config/data-source";
import { Category } from "./category.entity";
import { CategoryService } from "./category.service";

export * from "./category.entity";
export * from "./category-input.dto";
export * from "./category.route";

export const categoryRepository = AppDataSource.getRepository(Category);
export const categoryService = new CategoryService();
