import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({ 
  PORT: z.string().default("3000"),
  JWT_SECRET: z.string().min(1, "en variable JWT_SECRET must be set"),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
});

// Validate
const parsed = EnvSchema.parse(process.env);

export const config = {
  port: parseInt(parsed.PORT),
  jwtSecret: parsed.JWT_SECRET,
  nodeEnv: parsed.NODE_ENV,
};