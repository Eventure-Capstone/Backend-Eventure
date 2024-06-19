import express from "express";
import userController from "../controllers/user_controller.js";
import { authenticateJWT } from "../middlewares/auth_middleware.js";

const router = express.Router();

router.post("/register", userController.register);
router.post("/verify", userController.verify);
router.post("/login", userController.login);
router.get("/users", authenticateJWT, userController.getAllUsers);
router.get("/users/:id", authenticateJWT, userController.getUserById);
router.delete("/users/:id", authenticateJWT, userController.deleteUser);
router.put("/users/:id", authenticateJWT, userController.updateUser);
router.post("/createEvent", authenticateJWT, userController.createEvent);

export default router;
