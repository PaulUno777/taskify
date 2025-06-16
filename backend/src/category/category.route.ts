import { Router } from "express";
import { accessGuard } from "@shared/middleware";
import { CategoryController } from "./category.controller";

const router = Router();

router.post("/", accessGuard, CategoryController.create);
router.put("/:id", accessGuard, CategoryController.update);
router.delete("/:id", accessGuard, CategoryController.delete);
router.get("/:id", accessGuard, CategoryController.findOne);
router.get("/", accessGuard, CategoryController.findAll);

export { router as categoryRouter };
