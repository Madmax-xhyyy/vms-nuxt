import Joi from "joi";
import { schemaProduct, schemaProductUpdateStockById } from "../models/product.model.js";
import { useProductRepo } from "../repositories/product.repository.js";

export function useProductController() {
  // Get all
  async function getAll(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || "active";
    const search = req.query.search ?? "";
    try {
      const items = await useProductRepo().getAll({ page, limit, status, search });
      res.status(200).json(items);
      return;
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to get products" });
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
      const items = await useProductRepo().getById(req.params.id);
      res.status(200).json(items);
      return;
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to get product by id" });
      return;
    }
  }

  async function add(req, res) {
    const value = req.body;
    const { error } = schemaProduct.validate(value);
    if (error) {
      res
        .status(400)
        .json({ message: "Validation failed", errors: error.details });
      return;
    }

    try {
      const message = await useProductRepo().add(value);
      res.status(200).json({ message });
      return;
    } catch (error) {
      console.error("Error adding product:", error);
      res
        .status(500)
        .json({ message: error.message || "Failed to add product" });
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
      name: Joi.string().trim().min(1).max(200).required(),
      stock: Joi.number().required(),
      status: Joi.string().trim().max(200).optional(),
    });

    const { error: bodyError } = bodySchema.validate(req.body);
    if (bodyError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: bodyError.details,
      });
    }

    try {
      const message = await useProductRepo().updateById(
        req.params.id,
        req.body,
      );

      res.status(200).json({ message });
    } catch (error) {
      res.status(500).json({
        message: error.message || "Failed to update product",
      });
    }
  }

  async function updateStockById(req, res) {
    const validationSchema = Joi.object(schemaProductUpdateStockById);

    const { error } = validationSchema.validate(req.body);
    if (error) {
      res
        .status(400)
        .json({ message: "Validation failed", errors: error.details });
      return;
    }

    try {
      const message = await useProductRepo().updateStockById(
        req.body.id,
        req.body.stock,
      );
      res.status(200).json({ message });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to update product stock" });
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
      const message = await useProductRepo().deleteById(req.params.id);
      res.status(200).json({ message });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to delete product" });
      return;
    }
  }

  async function getStats(req, res) {
    try {
      const count = await useProductRepo().getCount();
      res.status(200).json({ count });
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to get product stats" });
    }
  }

  return { getAll, getById, add, updateById, updateStockById, deleteById, getStats };
}