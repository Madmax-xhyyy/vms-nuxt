import express from "express";
import { useUserController } from "../controllers/user.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

export default function useUserRoute() {
  const { getById, updateById } = useUserController();

  router.get("/id/:id", requireAuth, getById);
  router.patch("/id/:id", requireAuth, updateById);

  return router;
}
