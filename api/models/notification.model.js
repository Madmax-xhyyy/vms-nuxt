import Joi from "joi";
import { ObjectId } from "mongodb";

export const schemaNotification = Joi.object({
  _id: Joi.any().optional(),
  title: Joi.string().trim().min(1).max(200).required(),
  message: Joi.string().trim().min(1).max(500).required(),
  appointmentId: Joi.string().optional(), // reference only
  isRead: Joi.boolean().optional().default(false),
  createdAt: Joi.date().optional(),
});
export function modelNotification(value) {
  const { error } = schemaNotification.validate(value);

  if (error) {
    throw new Error(
      "Validation failed: " +
      error.details.map((d) => d.message).join(", ")
    );
  }

  return {
    _id: value._id ? new ObjectId(value._id) : new ObjectId(),
    title: value.title,
    message: value.message,
    appointmentId: value.appointmentId
      ? new ObjectId(value.appointmentId)
      : null,
    isRead: value.isRead ?? false,
    createdAt: value.createdAt ?? new Date(),
  };
}
