import express from "express";
import userRouter from "../routes/user_route.js";
import upload_router from "../routes/upload_route.js";
import event_router from "../routes/event_route.js";
import preference_router from "../routes/preference_route.js";
import { exceptionMiddleware } from "../middlewares/exception_middleware.js";
import { publicRouter } from "../routes/test_route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(publicRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", preference_router);
app.use("/api/v1", event_router);
app.use("/api/v1", upload_router);

app.use(exceptionMiddleware);

export default app;
