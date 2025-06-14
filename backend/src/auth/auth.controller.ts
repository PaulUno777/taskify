import { Request, Response } from "express";
import { UnauthorizedError } from "@shared/errors";
import { AuthController } from "./auth.service";

export async function register(req: Request, res: Response) {
  const { email, firstName, lastName, password } = req.body;

  const user = await AuthController.register(email, firstName, lastName, password);
  res.json(user);
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const tokens = await AuthController.login(email, password);
  res.json(tokens);
}

export async function refreshToken(req: Request, res: Response) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or invalid Authorization header.");
  }
  const refreshToken = authHeader.split(" ")[1];

  const tokens = await AuthController.refreshToken(refreshToken);
  
  res.json(tokens);
}
