import { Router } from "express";
import { accessGuard } from "@shared/middleware";
import { MessageController } from "./message.controller";

const router = Router();

router.post("/:taskId", accessGuard, MessageController.create);
router.get("/:taskId", accessGuard, MessageController.findAllForTask);
router.get("/:taskId/:id", accessGuard, MessageController.findOne);
router.put("/:taskId/:id", accessGuard, MessageController.update);
router.delete("/:taskId/:id", accessGuard, MessageController.delete);

export { router as messageRouter };
