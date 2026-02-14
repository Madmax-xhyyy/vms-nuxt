import Joi from "joi";

export const schemaUser = Joi.object({
  _id: Joi.any().optional(),
  firstName: Joi.string().required(),
  middleName: Joi.string().optional().allow("", null),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
  role: Joi.string().optional().allow("", null),
  status: Joi.string().optional().allow("", null),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
});

export function modelUser(value) {
  const { error } = schemaUser.validate(value);

  if (error) {
    throw new Error(
      "Validation failed: " + error.details.map((d) => d.message).join(", ")
    );
  }

  return {
    _id: value._id ? new ObjectId(value._id) : new ObjectId(),
    firstName: value.firstName,
    middleName: value.middleName ?? "",
    lastName: value.lastName,
    email: value.email,
    password: value.password,
    role: value.role ?? "admin",
    status: value.status ?? "active",
    createdAt: value.createdAt ?? new Date(),
    updatedAt: value.updatedAt ?? "",
  };
}