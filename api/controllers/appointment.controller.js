import Joi from "joi";
import { schemaAppoinment, schemaAppoinmentStatusUpdateById } from "../models/appoinment.model.js";
import { useAppoinmentRepo } from "../repositories/appoinment.repository.js";

export function useAppoinmentController() {
  // Get all
  async function getAll(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search ?? "";
    try {
      const items = await useAppoinmentRepo().getAll({ page, limit, status, search });
      res.status(200).json(items);
      return;
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to get appointments" });
      return;
    }
  }

  async function getById(req, res) {
    const validation = Joi.object({
      id: Joi.string().hex().length(24).required(),
    });

    const { error } = validation.validate(req.params.id);
    if (error) {
      res
        .status(400)
        .json({ message: "Validation failed", errors: error.details });
      return;
    }

    try {
      const items = await useAppoinmentRepo().getById(req.params.id);
      res.status(200).json(items);
      return;
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to get appointment by id" });
      return;
    }
  }

  async function add(req, res) {
    const value = req.body;
    const { error } = schemaAppoinment.validate(value);
    if (error) {
      res
        .status(400)
        .json({ message: "Validation failed", errors: error.details });
      return;
    }

    try {
      const message = await useAppoinmentRepo().add(value);
      res.status(200).json({ message });
      return;
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to add appointment" });
      return;
    }
  }

  async function updateById(req, res) {
    // 1️⃣ validate params ONLY
    const paramSchema = Joi.object({
      id: Joi.string().hex().length(24).required(),
    });

    const { error: paramError } = paramSchema.validate(req.params);
    if (paramError) {
      return res.status(400).json({
        message: "Invalid ID",
        errors: paramError.details,
      });
    }

    // 2️⃣ validate body ONLY
    const bodySchema = Joi.object({
      fullName: Joi.string().trim().min(1).max(200).required(),
      email: Joi.string().trim().max(200).required(),
      phone: Joi.string().trim().max(200).required(),
      address: Joi.string().trim().max(200).required(),
      petName: Joi.string().trim().max(200).required(),
      petType: Joi.string().trim().max(200).required(),
      petBreed: Joi.string().trim().max(200).required(),
      petAge: Joi.string().trim().max(200).required(),
      services: Joi.string().trim().max(200).required(),
      date: Joi.date().required(),
      time: Joi.string().trim().max(200).required(),
      status: Joi.string().trim().max(200).required(),
    });

    const { error: bodyError } = bodySchema.validate(req.body);
    if (bodyError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: bodyError.details,
      });
    }

    try {
      const message = await useAppoinmentRepo().updateById(
        req.params.id,
        req.body,
      );

      res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Failed to update appointment",
      });
    }
  }

  async function updateStatusById(req, res) {
    const validationSchema = Joi.object(schemaAppoinmentStatusUpdateById);

    const { error } = validationSchema.validate(req.body);
    if (error) {
      res
        .status(400)
        .json({ message: "Validation failed", errors: error.details });
      return;
    }

    try {
      const message = await useAppoinmentRepo().updateStatusById(
        req.body.id,
        req.body.status,
      );
      res.status(200).json({ message });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to update appointment status" });
    }
  }

  async function deleteById(req, res) {
    const validation = Joi.object({
      id: Joi.string().hex().length(24).required(),
    });

    const { error } = validation.validate(req.params);
    if (error) {
      res
        .status(400)
        .json({ message: "Validation failed", errors: error.details });
      return;
    }

    try {
      const message = await useAppoinmentRepo().deleteById(req.params.id);
      res.status(200).json({ message });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to delete appointment" });
      return;
    }
  }

  return { getAll, getById, add, updateById, updateStatusById, deleteById };
}