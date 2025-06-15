import { Router } from "express";
import { accessGuard } from "@shared/middleware";
import { CommentController } from "./category.controller";

const router = Router();

router.post("/", accessGuard, CommentController.create);
router.get("/:id", accessGuard, CommentController.findOne);
router.put("/:id", accessGuard, CommentController.update);
router.delete("/:id", accessGuard, CommentController.delete);

export { router as commentRouter };
