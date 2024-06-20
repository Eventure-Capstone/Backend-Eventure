import { v4 as uuidv4 } from "uuid";
import { bucket } from "../config/gcs.js";

const uploadImageToGCS = async (file) => {
  const fileExtension = file.originalname.split(".").pop();
  const fileName = `user-profile-images/${uuidv4()}.${fileExtension}`;
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

export default {
  uploadImageToGCS,
};
