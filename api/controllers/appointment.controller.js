import Joi from "joi";
import { schemaAppoinment } from "../models/appointment.model.js";
import { useAppointmentRepo } from "../repositories/appointment.repository.js";
import { useAppointmentService } from "../services/appointment.service.js";
import { BadRequestError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";

export function useAppointmentController() {
  const {
    getAll: _getAll,
    getAllPendingAppointments: _getAllPendingAppointments,
    getById: _getById,
    updateById: _updateById,
    updateStatusById: _updateStatusById,
    getAppointmentStatusCounts: _getAppointmentStatusCounts,
    deleteById: _deleteById,
    getBusySlotsByDate: _getBusySlotsByDate
  } = useAppointmentRepo();

  const {
    add: _add,
    updateStatusById: _updateStatusByIdService,
  } = useAppointmentService();
  // Get all
  async function getAll(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search ?? "";
    try {
      const items = await _getAll({ page, limit, status, search });
      res.status(200).json(items);
      return;
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to get appointments" });
      return;
    }
  }

  async function getAllPendingAppointments(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const status = "Pending";

    const search = req.query.search ?? "";

    try {
      const items = await _getAllPendingAppointments({
        page,
        limit,
        status,
        search
      });

      res.status(200).json(items);
      return;
    } catch (error) {
      res.status(500).json({
        message: error.message || "Failed to get pending appointments"
      });
      return;
    }
  }

  async function getById(req, res, next) {
    const id = req.params.id;

    const validation = Joi.object({
      id: Joi.string().hex().required(),
    });

    const { error } = validation.validate({ id });

    if (error) {
      next(new BadRequestError(error.message));
      return;
    }

    try {
      const appointment = await _getById(id);
      res.json(appointment);
      return;
    } catch (error) {
      next(error);
    }
  }

  async function add(req, res, next) {
    const value = req.body;

    const { error } = schemaAppoinment.validate(value);

    if (error) {
      next(new BadRequestError(error.message));
      logger.info(`Controller: ${error.message}`);
      return;
    }

    try {
      const result = await _add(value);
      res.json(result);
      return;
    } catch (error) {
      next(error);
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
      services: Joi.array().items(Joi.string().trim().min(1)).min(1).required(),
      dateTime: Joi.date().required(),
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
      const message = await useAppointmentRepo().updateById(
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
    const status = req.params.status;

    const validation = Joi.object({
      status: Joi.string()
        .valid("Approved", "Done", "Rejected")
        .required(),
    });

    const { error } = validation.validate({ status });
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.details,
      });
    }

    try {
      const message = await _updateStatusByIdService(
        req.params.id,
        status,
      );
      res.status(200).json({ message, status });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Failed to update appointment status",
      });
    }

  }

  async function getAppointmentStats(req, res, next) {
    try {
      const data = await _getAppointmentStatusCounts();

      const stats = {
        Pending: 0,
        Approved: 0,
        Done: 0,
        Rejected: 0,
      };

      data.forEach((item) => {
        if (item._id && stats.hasOwnProperty(item._id)) {
          stats[item._id] = item.count;
        }
      });

      res.status(200).json(stats);
    } catch (error) {
      next(error);
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
      const message = await useAppointmentRepo().deleteById(req.params.id);
      res.status(200).json({ message });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to delete appointment" });
      return;
    }
  }

  async function getBusySlots(req, res, next) {
    const date = req.query.date;

    const validation = Joi.object({
      date: Joi.date().required(),
    });

    const { error } = validation.validate({ date });

    if (error) {
      next(new BadRequestError(error.message));
      return;
    }

    try {
      const slots = await _getBusySlotsByDate(date);
      res.json(slots);
      return;
    } catch (error) {
      next(error);
    }
  }

  return { getAll, getAllPendingAppointments, getById, add, updateById, updateStatusById, getAppointmentStats, deleteById, getBusySlots };
}