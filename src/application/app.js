import express from "express";
import userRouter from "../routes/user_route.js";
import { exceptionMiddleware } from "../middlewares/exception_middleware.js";
import { publicRouter } from "../routes/test_route.js";

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(publicRouter);
app.use("/api/v1", userRouter);

app.use(exceptionMiddleware);
