import morgan from "morgan";
import { logger } from "./logger";

const stream = {
  write: (message: string) => {
    logger.info({ message: message.trim() });
  }
};

export const morganLogger = morgan("combined", { stream });