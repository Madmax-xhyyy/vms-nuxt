import express from "express";
import multer from "multer";
import { uploadImageController } from "../controllers/upload.controller.js";

const router = express.Router();
const upload = multer();

export default function useUploadRoute() {
  router.post("/", upload.single("image"), uploadImageController);
  return router;
}
