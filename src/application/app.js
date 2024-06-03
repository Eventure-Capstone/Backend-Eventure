import express from "express";
import { router } from "../routes/user_route.js";
import { exceptionMiddleware } from "../middlewares/exception_middleware.js";
import { publicRouter } from "../routes/test_route.js";

export const app = express();
app.use(express.json());

app.use(publicRouter);
app.use("/users", router);

app.use(exceptionMiddleware);
