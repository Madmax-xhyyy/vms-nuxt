import { Router } from "express";
import { useContactController } from "../controllers/contact.controller.js";

const router = Router();

export default function useContactRoute() {
  const { create } = useContactController();

  router.post("/", create);

  return router;
}
