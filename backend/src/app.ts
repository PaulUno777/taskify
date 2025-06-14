import express from "express";
import cors from "cors";
import { errorHandler } from "./error-handler";
import { authRouter } from "./auth/auth.route";
import { morganLogger } from "@shared/logger";
import { taskRouter } from "./task/task.route";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morganLogger);

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);

//Error handling
app.use(errorHandler);

export default app;
