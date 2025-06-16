import { Request, Response, NextFunction } from "express";
import {
  ConflictError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "@shared/errors";
import { logger } from "@shared/logger";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error({ 
    message: err?.message, 
    stack: err?.stack 
  });

  if (err instanceof ConflictError) {
    res.status(409).json({ message: err.message });
    return;
  }
  if (err instanceof UnauthorizedError) {
    res.status(401).json({ message: err.message });
    return;
  }
  if (err instanceof NotFoundError) {
    res.status(404).json({ message: err.message });
    return;
  }
  if (err instanceof ForbiddenError) {
    res.status(403).json({ message: err.message });
    return;
  }
  if (err instanceof InternalServerError) {
    res.status(500).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: "Something went wrong" });
}
