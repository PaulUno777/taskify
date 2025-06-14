import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production"]).default("development"),

  JWT_SECRET: z.string().nonempty("Variable JWT_SECRET must be set"),
  JWT_SECRET_REFRESH: z
    .string()
    .nonempty("Variable JWT_SECRET_REFRESH must be set"),

  ACCESS_TOKEN_EXPIRES_IN: z.coerce
    .number()
    .default(3600),
  REFRESH_TOKEN_EXPIRES_IN: z.coerce
    .number()
    .default(36000),
});

// Validate
const parsed = EnvSchema.parse(process.env);

export const config = {
  port: parsed.PORT,
  nodeEnv: parsed.NODE_ENV,

  jwtSecret: parsed.JWT_SECRET,
  jwtSecretRefresh: parsed.JWT_SECRET_REFRESH,

  accessTokenExpiresIn: parsed.ACCESS_TOKEN_EXPIRES_IN,
  refreshTokenExpiresIn: parsed.REFRESH_TOKEN_EXPIRES_IN,
};
