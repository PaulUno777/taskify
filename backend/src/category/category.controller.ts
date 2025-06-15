import { Response } from "express";
import { categoryService } from ".";

export class CategoryController {
  static async create(req: Record<string, any>, res: Response) {
    try {
      const userId = req?.user?.userId;

      const task = await categoryService.create(req.body, userId);
      res.status(202).json(task);
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }

  static async update(req: Record<string, any>, res: Response) {
    try {
      const userId = req?.user?.userId;
      const { id } = req.params;
      const task = await categoryService.update(id, userId, req.body);
      res.json(task);
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }

  static async delete(req: Record<string, any>, res: Response) {
    try {
      const userId = req?.user?.userId;

      const { id } = req.params;
      await categoryService.delete(id, userId);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }

  static async findOne(req: Record<string, any>, res: Response) {
    try {
      const userId = req?.user?.userId;

      const { id } = req.params;
      const task = await categoryService.findOne(id, userId);
      res.json(task);
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }

  static async findAll(req: Record<string, any>, res: Response) {
    try {
      const userId = req?.user?.userId;

      const tasks = await categoryService.findAll(userId);
      res.json(tasks);
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }
}
