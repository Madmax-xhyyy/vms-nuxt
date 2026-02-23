import express from "express";
import { useAuthController } from "../controllers/auth.controller.js";

const router = express.Router();

export default function useAuthRoute() {
  const { login, forgotPassword, resetPassword } = useAuthController();

  router.post("/", login);
  router.post("/forgot-password", forgotPassword);
  router.post("/reset-password", resetPassword);

  return router;
}