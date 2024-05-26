import express from "express";
import { publicRouter } from "../routes/test_route.js";
import { exceptionMiddleware } from "../middlewares/exception_middleware.js";

export const app = express();
app.use(express.json());

app.use(publicRouter);

app.use(exceptionMiddleware);
