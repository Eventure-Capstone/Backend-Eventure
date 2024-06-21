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


const createEvent = async (req, res, next) => {
  const user_id = req.user.id;
  const {
    title,
    category,
    description,
    banner,
    city,
    full_address,
    date,
    latitude,
    longitude,
    social_links,
  } = req.body;

  try {
    const newEvent = await eventServices.createEvent({
      user_id,
      title,
      category,
      description,
      banner,
      city,
      full_address,
      date,
      latitude,
      longitude,
      social_links,
    });

    res.status(201).json({
      success: true,
      message: "Event successfully created",
      data: newEvent,
    });
  } catch (error) {
    next(error);
  }
};

const uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      throw new ResponseError(400, "No file uploaded.");
    }

    const publicUrl = await eventServices.uploadBannerToGCS(req.file);
    res.status(201).json({
      success: true,
      message: "Image successfully uploaded",
      data: {
        banner_url: publicUrl,
      },
    });
  } catch (err) {
    console.error("Error uploading file:", err);
    next(err);
  }
};

const getEventById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const event = await eventServices.getEventById(id);

    if (!event) {
      throw new ResponseError(404, "Event not found");
    }

    res.status(200).json({
      success: true,
      message: "Get event detail",
      data: event,
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
  getEventById,
  uploadBanner,
  createEvent,
  saveEvent,
  deleteSavedEvent,
};
