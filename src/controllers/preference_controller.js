import PreferenceServices from "../services/preference_service.js";

const saveUserPreference = async (req, res, next) => {
  const user_id = req.user.id;
  const { preference_ids } = req.body;

  try {
    const result = await PreferenceServices.saveUserPreference(
      user_id,
      preference_ids
    );
    res.status(201).json({
      success: true,
      message: "User preferences saved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPreferences = async (req, res, next) => {
  try {
    const preferences = await PreferenceServices.getAllPreferences();
    res.status(200).json({
      success: true,
      message: "Successfully retrieved preferences",
      data: preferences,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  saveUserPreference,
  getAllPreferences,
};
