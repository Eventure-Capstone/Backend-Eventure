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

export default {
  getEventsNearby,
};
