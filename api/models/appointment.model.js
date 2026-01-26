import Joi from "joi";

export const schemaAppoinment = Joi.object({
  _id: Joi.string().hex().length(24).required(),
  fullName: Joi.string().trim().min(1).max(200).required(),
  email: Joi.string().trim().min(1).max(200).required(),
  phone: Joi.string().trim().min(1).max(200).required(),
  address: Joi.string().trim().min(1).max(200).required(),
  petName: Joi.string().trim().min(1).max(200).required(),
  petType: Joi.string().trim().min(1).max(200).required(),
  petBreed: Joi.string().trim().min(1).max(200).required(),
  petAge: Joi.string().trim().min(1).max(200).required(),
  services: Joi.array().required(),
  date: Joi.date().required(),
  time: Joi.string().trim().min(1).max(200).required(),
  status: Joi.string().trim().max(200).required(),
  createdAt: Joi.date().required(),
});

export const schemaAppoinmentStatusUpdateById = Joi.object({
  _id: Joi.string().hex().length(24).required(),
  status: Joi.string().trim().max(200).required(),
  updatedAt: Joi.date().required(),
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
    _id: value._id,
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
    updatedAt: value.updatedAt,
    deletedAt: value.deletedAt,
  };
}
