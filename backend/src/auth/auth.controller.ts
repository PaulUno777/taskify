import { Request, Response } from "express";
import { UserService } from "./auth.service";

const service = new UserService();

export async function register(req: Request, res: Response) {
  const { email, firstName, lastName, password } = req.body;
  try {
    const user = await service.createUser(email, firstName, lastName, password);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: "User already exists or invalid" });
  }
}