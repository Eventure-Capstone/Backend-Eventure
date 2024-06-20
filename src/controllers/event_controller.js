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

export default {
  getEventsNearby,
};
