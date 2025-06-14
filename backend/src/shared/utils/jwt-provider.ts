// src/shared/utils/JwtService.ts
import jwt from "jsonwebtoken";
import { config } from "../../config/config";

export interface JwtPayload {
  userId: string;
  email: string;
}

interface TokenOutput {
  token: string;
  expiresIn: number;
}

export class JwtService {
  static generateAccessToken(payload: JwtPayload): TokenOutput {
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.accessTokenExpiresIn,
    });
    return {
      token,
      expiresIn: config.accessTokenExpiresIn,
    };
  }

  static generateRefreshToken(payload: JwtPayload): TokenOutput {
    const token = jwt.sign(payload, config.jwtSecretRefresh, {
      expiresIn: config.refreshTokenExpiresIn,
    });
    return {
      token,
      expiresIn: config.accessTokenExpiresIn,
    };
  }

  static verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, config.jwtSecret) as JwtPayload;
    } catch {
      return null;
    }
  }
}
