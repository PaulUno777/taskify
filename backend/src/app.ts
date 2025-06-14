import express from "express";
import cors from "cors";
import { errorHandler } from "./error-handler";
import authRouter from "./auth/auth.route";
import { morganLogger } from "@shared/logger";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morganLogger);

app.use("/api/auth", authRouter);

//Error handling
app.use(errorHandler);

export default app;
