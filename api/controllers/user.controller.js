import { useUserRepo } from "../repositories/user.repository.js";
import Joi from "joi";
import { schemaUser, schemaUserUpdate } from "../models/user.model.js";
import { hashPassword } from "../utils/hash-password.util.js";

export function useUserController() {

  async function getById(req, res) {
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
      const items = await useUserRepo().getById(req.params.id);
      res.status(200).json(items);
      return;
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to get user by id" });
      return;
    }
  }

  async function updateById(req, res) {
    const { id } = req.params;

    // Validate ID
    const { error: idError } = Joi.string()
      .hex()
      .length(24)
      .required()
      .validate(id);
    if (idError) {
      res.status(400).json({ message: "Invalid ID details" });
      return;
    }

    const { value, error } = schemaUserUpdate.validate({
      ...req.body,
      updatedAt: new Date()
    }, { stripUnknown: true });

    if (error) {
      res
        .status(400)
        .json({ message: "Validation failed", errors: error.details });
      return;
    }

    // Hash password if it's being updated
    if (value.password) {
      value.password = await hashPassword(value.password);
    }

    try {
      const message = await useUserRepo().updateById(
        id,
        value
      );
      res.status(200).json({ message });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: error.message || "Failed to update user" });
      return;
    }
  }

  return {
    getById,
    updateById,
  };
}
