import { Router } from "express";
import { accessGuard } from "@shared/middleware";
import { CommentController } from "./comment.controller";

const router = Router();

router.post("/:taskId", accessGuard, CommentController.create);
router.get("/:taskId/:id", accessGuard, CommentController.findOne);
router.put("/:taskId/:id", accessGuard, CommentController.update);
router.delete("/:taskId/:id", accessGuard, CommentController.delete);

export { router as commentRouter };
