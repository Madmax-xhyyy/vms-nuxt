import cloudinary from "../utils/cloudinary.js";

export async function uploadImage(file, mimeType) {
  const base64 = `data:${mimeType};base64,${file.toString("base64")}`;

  const result = await cloudinary.uploader.upload(base64, {
    folder: "products",
  });

  return result.secure_url;
}
