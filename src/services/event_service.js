import prisma from "../application/database.js";
import { v4 as uuidv4 } from "uuid";
import { bucket } from "../config/gcs.js";

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

const createEvent = async (eventData) => {
  const {
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
  } = eventData;

  try {
    const newEvent = await prisma.event.create({
      data: {
        title,
        author_id: user_id,
        category,
        description,
        banner,
        city,
        full_address,
        date,
        latitude,
        longitude,
        social_links: {
          create: social_links ? social_links : [],
        },
      },
      include: {
        social_links: true,
      },
    });

    return newEvent;
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

const uploadBannerToGCS = async (file) => {
  const fileExtension = file.originalname.split(".").pop();
  const fileName = `event-banners/${uuidv4()}.${fileExtension}`;
  const fileUpload = bucket.file(fileName);

  const stream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    stream.on("error", (err) => {
      reject(err);
    });

    stream.on("finish", async () => {
      await fileUpload.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      resolve(publicUrl);
    });

    stream.end(file.buffer);
  });
};

const getEventById = async (id) => {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        author: true,
        social_links: true,
      },
    });

    return event;
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
  uploadBannerToGCS,
  getEventById,
  createEvent,
  saveEvent,
  deleteSavedEvent,
};
