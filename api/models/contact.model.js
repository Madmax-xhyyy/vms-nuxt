import Joi from "joi";
import { ObjectId } from "mongodb";

export const schemaContact = Joi.object({
  _id: Joi.any().optional(),
  fullName: Joi.string().trim().min(1).max(200).required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().allow("").optional(),
  message: Joi.string().trim().min(1).max(2000).required(),
  createdAt: Joi.date().optional(),
  deletedAt: Joi.date().allow("").optional(),
});

export function modelContact(value) {
  const { error } = schemaContact.validate(value);

  if (error) {
    throw new Error(
      "Validation failed: " +
      error.details.map((d) => d.message).join(", ")
    );
  }

  return {
    _id: value._id ? new ObjectId(value._id) : new ObjectId(),
    fullName: value.fullName,
    email: value.email,
    phone: value.phone ?? "",
    message: value.message,
    createdAt: value.createdAt ?? new Date(),
    deletedAt: value.deletedAt ?? "",
  };
}
