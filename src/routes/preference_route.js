import express from "express";
import preferenceControllers from "../controllers/preference_controller.js";
import { authenticateJWT } from "../middlewares/auth_middleware.js";

const router = express.Router();

router.get("/preferences", preferenceControllers.getAllPreferences);
router.post(
  "/preferences",
  authenticateJWT,
  preferenceControllers.saveUserPreference
);

export default router;
