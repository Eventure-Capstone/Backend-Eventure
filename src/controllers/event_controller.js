import { ResponseError } from "../exceptions/exceptions.js";
import eventServices from "../services/event_service.js";

const getEventsNearby = async (req, res, next) => {
  const { latitude, longitude, radius } = req.query;

  try {
    const events = await eventServices.getEventsNearby(
      parseFloat(latitude),
      parseFloat(longitude),
      parseInt(radius)
    );
    res.status(200).json({
      success: true,
      message: "Successfully retrieved nearby events",
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

const saveEvent = async (req, res, next) => {
  const user_id = req.user.id;
  const { event_id } = req.body;
  console.log(req.body);
  try {
    if (!event_id) {
      throw new ResponseError(400, "Event ID is required");
    }

    const savedEvent = await eventServices.saveEvent(user_id, event_id);

    res.status(201).json({
      success: true,
      message: "Event successfully saved",
      data: savedEvent,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSavedEvent = async (req, res, next) => {
  const user_id = req.user.id;
  const { event_id } = req.body;

  try {
    await eventServices.deleteSavedEvent(user_id, event_id);

    res.status(200).json({
      success: true,
      message: "Saved event successfully deleted",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getEventsNearby,
  saveEvent,
  deleteSavedEvent,
};
