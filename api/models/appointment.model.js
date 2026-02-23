import Joi from "joi";
import { ObjectId } from "mongodb";

export const schemaAppoinment = Joi.object({
  _id: Joi.any().optional(),
  code: Joi.string().trim().min(1).max(200).optional(),
  fullName: Joi.string().trim().min(1).max(200).required(),
  email: Joi.string().trim().min(1).max(200).required(),
  phone: Joi.string().trim().min(1).max(200).required(),
  address: Joi.string().trim().min(1).max(200).required(),
  petName: Joi.string().trim().min(1).max(200).required(),
  petType: Joi.string().trim().min(1).max(200).required(),
  petBreed: Joi.string().trim().min(1).max(200).required(),
  petAge: Joi.string().trim().min(1).max(200).required(),
  services: Joi.array().items(Joi.string().trim().min(1)).min(1).required(),
  dateTime: Joi.date().required(),
  status: Joi.string().trim().max(200).optional().default("Pending"),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().allow("").optional(),
  deletedAt: Joi.date().allow("").optional(),
});

export const schemaAppoinmentStatusUpdateById = Joi.object({
  status: Joi.string().trim().max(200).required().valid("Approved", "Done", "Rejected"),
});

export function modelAppoinment(value) {
  const { error, value: validatedValue } = schemaAppoinment.validate(value);

  if (error) {
    throw new Error(
      "Validation failed: " + error.details.map((d) => d.message).join(", ")
    );
  }

  return {
    _id: validatedValue._id ? new ObjectId(validatedValue._id) : new ObjectId(),
    code: validatedValue.code,
    fullName: validatedValue.fullName,
    email: validatedValue.email,
    phone: validatedValue.phone,
    address: validatedValue.address,
    petName: validatedValue.petName,
    petType: validatedValue.petType,
    petBreed: validatedValue.petBreed,
    petAge: validatedValue.petAge,
    services: validatedValue.services,
    dateTime: validatedValue.dateTime,
    status: validatedValue.status,
    createdAt: validatedValue.createdAt ?? new Date(),
    updatedAt: validatedValue.updatedAt ?? "",
    deletedAt: validatedValue.deletedAt ?? "",
  };
}
