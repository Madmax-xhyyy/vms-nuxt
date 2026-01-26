import express from "express";
import { useAppointmentController } from "../controllers/appointment.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

export default function useAppointmentRoute() {
  // Get all
  router.get("/", requireAuth, useAppointmentController().getAll);

  // Get by id
  router.get("/id/:id", requireAuth, useAppointmentController().getById);

  // Add new
  router.post("/", requireAuth, useAppointmentController().add);

  // Update by id
  router.patch("/id/:id", requireAuth, useAppointmentController().updateById);

  // Update status by id
  router.patch("/id/:id/status/:status", requireAuth, useAppointmentController().updateStatusById);

  // Get all pending appointments
  router.get("/status/pending", requireAuth, useAppointmentController().getAllPendingAppointments);

  // Delete by id
  router.delete("/id/:id", requireAuth, useAppointmentController().deleteById);

  return router;
}