import { Router } from "express";
import { TaskController } from "./task.controller";
import { accessGuard } from "@shared/middleware";

const router = Router();

router.post("/", accessGuard, TaskController.create);
router.post("/:id/share", accessGuard, TaskController.share);
router.put("/:id", accessGuard, TaskController.update);
router.delete("/:id", accessGuard, TaskController.delete);
router.get("/:id", accessGuard, TaskController.findOne);
router.get("/", accessGuard, TaskController.findAllForUser);

export { router as taskRouter };
