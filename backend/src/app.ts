import express from "express";
import cors from "cors";
import { errorHandler } from "./error-handler";
import authRouter from "./auth/auth.route";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/", (req, res) => {
  res.send("Hello from server!");
});

app.use("/api/auth", authRouter);

//Error handling
app.use(errorHandler);

export default app;
