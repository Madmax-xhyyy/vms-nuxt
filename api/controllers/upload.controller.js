import { uploadImage } from "../services/upload.service.js";

export async function uploadImageController(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const imageUrl = await uploadImage(req.file.buffer, req.file.mimetype);

    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to upload image" });
  }
}
