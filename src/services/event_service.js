import prisma from "../application/database.js";

const getEventsNearby = async (latitude, longitude, radius) => {
  try {
    const events = await prisma.$queryRaw`
            SELECT *,
                (6371 * acos(
                    cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) +
                    sin(radians(${latitude})) * sin(radians(latitude))
                )) AS distance
            FROM "Event"
            GROUP BY "Event".id
            HAVING (6371 * acos(
                    cos(radians(${latitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${longitude})) +
                    sin(radians(${latitude})) * sin(radians(latitude))
                )) < ${radius}
            ORDER BY distance;
        `;
    return events;
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

const saveEvent = async (user_id, event_id) => {
  try {
    const savedEvent = await prisma.userSavedEvent.create({
      data: {
        user_id,
        event_id,
      },
    });
    return savedEvent;
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

const deleteSavedEvent = async (user_id, event_id) => {
  try {
    await prisma.userSavedEvent.delete({
      where: {
        user_id_event_id: {
          user_id,
          event_id,
        },
      },
    });
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

export default {
  getEventsNearby,
  saveEvent,
  deleteSavedEvent,
};
