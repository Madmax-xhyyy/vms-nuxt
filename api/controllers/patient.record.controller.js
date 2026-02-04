import Joi from "joi";
import { usePatientRecordRepo } from "../repositories/patient.record.repository.js";
import { BadRequestError } from "../utils/error.util.js";
import { logger } from "../utils/logger.util.js";

export function usePatientRecordController() {
  const {
    getAll: _getAll,
    getById: _getById,
    add: _add,
    updateById: _updateById,
    deleteById: _deleteById,
    getCount: _getCount,
  } = usePatientRecordRepo();

  async function getStats(req, res) {
    try {
      const count = await _getCount();
      res.status(200).json({ count });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Failed to get patient record stats",
      });
    }
  }


  async function getAll(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search ?? "";
    const status = req.query.status ?? "active";

    try {
      const items = await _getAll({ page, limit, search, status });
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({
        message: error.message || "Failed to get patient records",
      });
    }
  }

  async function getById(req, res, next) {
    const paramSchema = Joi.object({
      id: Joi.string().hex().length(24).required(),
    });

    const { error } = paramSchema.validate(req.params);
    if (error) {
      next(new BadRequestError("Invalid ID"));
      return;
    }

    try {
      const record = await _getById(req.params.id);
      res.status(200).json(record);
    } catch (error) {
      next(error);
    }
  }

  async function add(req, res, next) {
    try {
      const message = await _add(req.body);
      res.status(201).json({ message });
    } catch (error) {
      logger.error(error.message);
      next(error);
    }
  }

  async function updateById(req, res) {
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

    try {
      const message = await _updateById(req.params.id, req.body);
      res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Failed to update patient record",
      });
    }
  }

  async function deleteById(req, res) {
    const paramSchema = Joi.object({
      id: Joi.string().hex().length(24).required(),
    });

    const { error } = paramSchema.validate(req.params);
    if (error) {
      return res.status(400).json({
        message: "Invalid ID",
        errors: error.details,
      });
    }

    try {
      const message = await _deleteById(req.params.id);
      res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Failed to delete patient record",
      });
    }
  }

  return {
    getAll,
    getById,
    add,
    updateById,
    deleteById,
    getStats,
  };
}
