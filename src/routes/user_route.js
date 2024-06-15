import express from "express";
import userController from "../controllers/user_controller.js";

const router = express.Router();

router.post("/register", userController.register);
router.post("/verify", userController.verify);
router.post("/login", userController.login);
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.delete("/users/:id", userController.deleteUser);
router.put("/users/:id", userController.updateUser);
router.post("/createEvent", userController.createEvent);


export default router;
