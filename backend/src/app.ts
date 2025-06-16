import express from "express";
import cors from "cors";
import { errorHandler } from "./error-handler";
import { authRouter } from "./auth/auth.route";
import { morganLogger } from "@shared/logger";
import { taskRouter } from "./task/task.route";
import { categoryRouter } from "./category/category.route";
import { messageRouter } from "./message/message.route";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morganLogger);

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/messages", messageRouter);
app.use("/api/categories", categoryRouter);
//Error handling
app.use(errorHandler);

export default app;
