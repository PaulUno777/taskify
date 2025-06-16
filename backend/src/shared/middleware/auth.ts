import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "@shared/errors";
import { JwtService } from "@shared/utils";
import { logger } from "@shared/logger";

export function accessGuard(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization")?.replace("Bearer ", "").trim();

  if (!token) {
    return next(
      new UnauthorizedError("Missing or invalid authorization header.")
    );
  }
  try {
    const payload = JwtService.verifyToken(token);
    (req as any).user = payload;

    next();
  } catch (error) {
    logger.error(error);
    next(new UnauthorizedError("Invalid or expired access token."));
  }
}

export function refreshGuard(req: Request, res: Response, next: NextFunction) {
  const token = req.header("Authorization")?.replace("Bearer ", "").trim();
  if (!token) {
    return next(new UnauthorizedError("Missing refresh token."));
  }
  try {
    const payload = JwtService.verifyToken(token, true);
    (req as any).refreshPayload = payload;
    next();
  } catch (error) {
    logger.error(error);
    next(new UnauthorizedError("Invalid or expired refresh token."));
  }
}
