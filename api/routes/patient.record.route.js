import express from "express";
import { usePatientRecordController } from "../controllers/patient.record.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

export default function usePatientRecordRoute() {
  // Get all
  router.get("/", requireAuth, usePatientRecordController().getAll);

  // Get stats
  router.get("/stats", requireAuth, usePatientRecordController().getStats);

  // Get by id
  router.get("/id/:id", requireAuth, usePatientRecordController().getById);

  // Add new
  router.post("/", usePatientRecordController().add);

  // Update by id
  router.patch("/id/:id", requireAuth, usePatientRecordController().updateById);

  // Delete by id
  router.delete("/id/:id", requireAuth, usePatientRecordController().deleteById);

  return router;
}