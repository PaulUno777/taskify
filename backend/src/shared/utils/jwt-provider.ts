// src/shared/utils/JwtService.ts
import jwt from "jsonwebtoken";
import { config } from "../../config/config";

export interface JwtPayload {
  userId: string;
  email: string;
}

interface TokenOutput {
  token: string;
  type: string;
  expiresIn: number;
}

export class JwtService {
  static generateAccessToken(payload: JwtPayload): TokenOutput {
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.accessTokenExpiresIn,
    });
    return {
      token,
      type: 'Bearer',
      expiresIn: config.accessTokenExpiresIn,
    };
  }

  static generateRefreshToken(payload: JwtPayload): TokenOutput {
    const token = jwt.sign(payload, config.jwtSecretRefresh, {
      expiresIn: config.refreshTokenExpiresIn,
    });
    return {
      token,
      type: 'Bearer',
      expiresIn: config.refreshTokenExpiresIn,
    };
  }

  static verifyToken(token: string, isRefresh = false) {
    try {
      const secret = isRefresh ?config.jwtSecretRefresh :config.jwtSecret
      return jwt.verify(token, secret);
    } catch(error) {
       throw error;
    }
  }

  static decodeToken(token: string, isRefresh = false) {
    try {
      return jwt.decode(token);
    } catch(error) {
       throw error;
    }
  }
}
