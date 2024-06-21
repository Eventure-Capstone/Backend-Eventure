import express from "express";
import eventController from "../controllers/event_controller.js";
import { authenticateJWT } from "../middlewares/auth_middleware.js";
import upload from "../middlewares/multer_middleware.js";
const router = express.Router();

router.post("/events/", authenticateJWT, eventController.createEvent);
router.post(
  "/events/banner",
  authenticateJWT,
  upload.single("banner"),
  eventController.uploadBanner
);
router.get("/events/nearby", eventController.getEventsNearby);
router.get("/events/:id", eventController.getEventById);
router.post("/events/save", authenticateJWT, eventController.saveEvent);
router.delete(
  "/events/delete-saved",
  authenticateJWT,
  eventController.deleteSavedEvent
);
export default router;
