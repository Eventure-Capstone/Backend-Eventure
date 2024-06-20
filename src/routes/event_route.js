import express from "express";
import eventController from "../controllers/event_controller.js";

const router = express.Router();

router.get("/events/nearby", eventController.getEventsNearby);

export default router;
