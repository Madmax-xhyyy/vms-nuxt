import Joi from "joi";
import { ObjectId } from "mongodb";

export const schemaPatientRecord = Joi.object({
  _id: Joi.any().optional(),
  ownerName: Joi.string().required(),
  ownerEmail: Joi.string().email().required(),
  ownerPhone: Joi.string().required(),
  ownerAddress: Joi.string().required(),
  status: Joi.string().optional(),

  pets: Joi.array().items(
    Joi.object({
      petName: Joi.string().required(),
      petType: Joi.string().required(),
      petBreed: Joi.string().required(),
      petAge: Joi.string().required(),

      history: Joi.array().items(
        Joi.object({
          appointmentId: Joi.any().required(),
          services: Joi.array().items(Joi.string()).required(),
          date: Joi.date().required(),
          time: Joi.string().required(),
          notes: Joi.string().allow("").optional(),
        })
      )
    })
  ).required(),

  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
  deletedAt: Joi.date().optional(),
});

export const modelPatientRecord = (value) => {
  const { error } = schemaPatientRecord.validate(value);

  if (error) {
    throw new Error(
      "Validation failed: " + error.details.map((d) => d.message).join(", "
      )
    );
  }

  return {
    _id: value._id ? new ObjectId(value._id) : new ObjectId(),
    ownerName: value.ownerName,
    ownerEmail: value.ownerEmail,
    ownerPhone: value.ownerPhone,
    ownerAddress: value.ownerAddress,
    status: value.status ?? "active",
    pets: value.pets,
    createdAt: value.createdAt ?? new Date(),
    updatedAt: value.updatedAt,
    deletedAt: value.deletedAt,
  };
};
