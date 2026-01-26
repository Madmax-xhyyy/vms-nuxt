import express from "express";
import { useAppoinmentController } from "../controllers/appointment.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

export default function useAppoinmentRoute() {
  // Get all
  router.get("/", requireAuth, useAppoinmentController().getAll);

  // Get by id
  router.get("/id/:id", requireAuth, useAppoinmentController().getById);

  // Add new
  router.post("/", requireAuth, useAppoinmentController().add);

  // Update by id
  router.patch("/id/:id", requireAuth, useAppoinmentController().updateById);

  // Update status by id
  router.patch("/id/:id/status/:status", requireAuth, useAppoinmentController().updateStatusById);

  // Delete by id
  router.delete("/id/:id", requireAuth, useAppoinmentController().deleteById);

  return router;
}