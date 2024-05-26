import express from "express";
import testController from "../controllers/test_controller.js";

const publicRouter = new express.Router();
publicRouter.get("/ping", testController.ping);

export { publicRouter };
