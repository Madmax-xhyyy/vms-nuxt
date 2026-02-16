import express from "express";
import { useSystemInfoController } from "../controllers/system.info.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

export default function useSystemInfoRoute() {
  // Get system info
  router.get("/", useSystemInfoController().get);

  // Upsert system info
  router.post("/", requireAuth, useSystemInfoController().upsert);

  return router;
}
