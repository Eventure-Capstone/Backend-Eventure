const ping = async (req, res, next) => {
  try {
    res.status(200).json({
      data: "pong",
    });
  } catch (e) {
    next(e);
  }
};

export default {
  ping,
};
