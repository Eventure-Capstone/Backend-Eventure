import express from "express";
import userController from "../controllers/user_controller.js";
import { authenticateJWT } from "../middlewares/auth_middleware.js";
import upload from "../middlewares/multer_middleware.js";
const router = express.Router();

router.post("/register", userController.register);
router.post("/verify", userController.verify);
router.post("/login", userController.login);
router.post(
  "/users/profile_img",
  authenticateJWT,
  upload.single("profile_img"),
  userController.uploadProfileImage
);
router.get("/users", authenticateJWT, userController.getAllUsers);
router.get("/users/me", authenticateJWT, userController.getUserById);
router.put("/users/:id", authenticateJWT, userController.updateUser);
router.post("/createEvent", authenticateJWT, userController.createEvent);

export default router;
