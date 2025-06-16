import { Router } from "express";
import { getProfile, login, refreshToken, register } from "./auth.controller";
import { authenticateAccess, authenticateRefresh } from "@shared/middleware";

const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/profile", authenticateAccess, getProfile);
authRouter.post("/refresh-token", authenticateRefresh, refreshToken);

export default authRouter;
