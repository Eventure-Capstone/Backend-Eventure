import prisma from "../application/database.js";

const saveUserPreference = async (user_id, preferences_id) => {
  const userPreferences = preferences_id.map((preference_id) => {
    return {
      user_id,
      preferences_id: preference_id,
    };
  });

  return await prisma.userPreferences.createMany({
    data: userPreferences,
  });
};

const getAllPreferences = async () => {
  return await prisma.preference.findMany();
};

export default {
  saveUserPreference,
  getAllPreferences,
};
