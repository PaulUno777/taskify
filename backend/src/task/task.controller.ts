import { Response } from "express";
import { taskService } from ".";
import { parseQueryToDto } from "@shared/utils";

export class TaskController {
  static async create(req: Record<string, any>, res: Response) {
    try {
      const userId = req?.user?.userId;

      const task = await taskService.create(req.body, userId);
      res.status(201).json(task);
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }

  static async update(req: Record<string, any>, res: Response) {
    try {
      const userId = req?.user?.userId;
      const { id } = req.params;
      const task = await taskService.update(id, userId, req.body);
      res.json(task);
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }

  static async delete(req: Record<string, any>, res: Response) {
    try {
      const userId = req?.user?.userId;

      const { id } = req.params;
      await taskService.delete(id, userId);
      res.json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }

  static async findOne(req: Record<string, any>, res: Response) {
    try {
      const userId = req?.user?.userId;

      const { id } = req.params;
      const task = await taskService.findOne(id, userId);
      res.json(task);
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }

  static async findAllForUser(req: Record<string, any>, res: Response) {
    try {
      const userId = req?.user?.userId;

      const filter = parseQueryToDto(req.query);
      const tasks = await taskService.findAllForUser(userId, filter);
      res.json(tasks);
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }

  static async share(req: Record<string, any>, res: Response) {
    try {
      const userId = req?.user?.userId;
      const { id } = req.params;
      const { friendEmail, permission } = req.body;
      const tasks = await taskService.share(
        id,
        userId,
        friendEmail,
        permission
      );
      res.json(tasks);
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }
}
