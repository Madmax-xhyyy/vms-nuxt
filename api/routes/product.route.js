import express from "express";
import { useProductController } from "../controllers/product.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

export default function useProductRoute() {
  // Get all
  router.get("/", requireAuth, useProductController().getAll);

  // Get stats
  router.get("/stats", requireAuth, useProductController().getStats);

  // Get by id
  router.get("/id/:id", requireAuth, useProductController().getById);

  // Add new
  router.post("/", requireAuth, useProductController().add);

  // Update by id
  router.patch("/id/:id", requireAuth, useProductController().updateById);

  // Update stock by id
  router.patch("/id/:id/stock/:stock", requireAuth, useProductController().updateStockById);

  // Delete by id
  router.delete("/id/:id", requireAuth, useProductController().deleteById);

  return router;
}