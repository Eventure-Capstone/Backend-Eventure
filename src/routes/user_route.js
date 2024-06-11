import express from "express";
import userController from "../controllers/user_controller.js";

const router = express.Router();

router.post("/register", userController.register);
router.post("/verify", userController.verify);
router.post("/login", userController.login);

export default router;
