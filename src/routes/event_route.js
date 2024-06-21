import express from "express";
import eventController from "../controllers/event_controller.js";
import { authenticateJWT } from "../middlewares/auth_middleware.js";
const router = express.Router();

router.get("/events/nearby", eventController.getEventsNearby);
router.post("/events/save", authenticateJWT, eventController.saveEvent);
router.delete(
  "/events/delete-saved",
  authenticateJWT,
  eventController.deleteSavedEvent
);
export default router;
