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
  date: Joi.date().required(),
  time: Joi.string().trim().min(1).max(200).required(),
  status: Joi.string().trim().max(200).optional().default("Pending"),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().allow("").optional(),
  deletedAt: Joi.date().allow("").optional(),
});

export const schemaAppoinmentStatusUpdateById = Joi.object({
  status: Joi.string().trim().max(200).required().valid("Approved", "Done", "Rejected"),
});

export function modelAppoinment(value) {
  const { error } = schemaAppoinment.validate(value);

  if (error) {
    throw new Error(
      "Validation failed: " + error.details.map((d) => d.message).join(", "
      )
    );
  }

  return {
    _id: value._id ? new ObjectId(value._id) : new ObjectId(),
    code: value.code,
    fullName: value.fullName,
    email: value.email,
    phone: value.phone,
    address: value.address,
    petName: value.petName,
    petType: value.petType,
    petBreed: value.petBreed,
    petAge: value.petAge,
    services: value.services,
    date: value.date,
    time: value.time,
    status: value.status,
    createdAt: value.createdAt ?? new Date(),
    updatedAt: value.updatedAt ?? "",
    deletedAt: value.deletedAt ?? "",
  };
}
