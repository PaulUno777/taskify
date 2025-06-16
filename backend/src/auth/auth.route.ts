import { Router } from "express";
import { getProfile, login, refreshToken, register } from "./auth.controller";
import { accessGuard, refreshGuard } from "@shared/middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", accessGuard, getProfile);
router.post("/refresh-token", refreshGuard, refreshToken);

export { router as authRouter };
