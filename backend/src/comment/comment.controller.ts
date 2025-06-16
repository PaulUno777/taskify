import { Response } from "express";
import { commentService } from ".";

export class CommentController {
  static async create(req: Record<string, any>, res: Response) {
    try {
      const userId = req?.user?.userId;
      const { taskId } = req.params;
      const { content } = req.body;
      const result = await commentService.create({
        content,
        taskId,
        authorId: userId,
      });
      res.status(201).json(result);
    } catch (err) {
      console.log(err)
      res.status(400).json({ message: (err as Error).message });
    }
  }

  static async update(req: Record<string, any>, res: Response) {
    try {
      const userId = req?.user?.userId;
      const { id } = req.params;
      const { content } = req.body;

      const result = await commentService.update(id, userId, content);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }

  static async delete(req: Record<string, any>, res: Response) {
    try {
      const userId = req?.user?.userId;
      const { id } = req.params;

      const result = await commentService.delete(id, userId);
      res.json(result);
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }

  static async findOne(req: Record<string, any>, res: Response) {
    try {
      const { id } = req.params;
      const result = await commentService.findOne(id);

      res.json(result);
    } catch (err) {
      res.status(400).json({ message: (err as Error).message });
    }
  }
}
