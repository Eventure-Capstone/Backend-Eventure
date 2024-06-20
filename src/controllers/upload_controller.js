import uploadServices from "../services/upload_service.js";

const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const publicUrl = await uploadServices.uploadImageToGCS(req.file);
    res.status(200).json({ imageUrl: publicUrl });
  } catch (err) {
    console.error("Error uploading file:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

export { uploadImage };
