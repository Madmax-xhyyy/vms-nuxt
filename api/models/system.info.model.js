import Joi from "joi";
import { ObjectId } from "mongodb";

export const schemaSystemInfo = Joi.object({
  _id: Joi.any().optional(),

  clinicName: Joi.string().trim().min(1).max(200).required(),
  tagline: Joi.string().trim().max(300).optional(),
  description: Joi.string().trim().max(1000).optional(),

  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().min(1).max(50).required(),
  address: Joi.string().trim().min(1).max(300).required(),

  logoUrl: Joi.string().trim().allow("").optional(),
  faviconUrl: Joi.string().trim().allow("").optional(),

  primaryColor: Joi.string().trim().allow("").optional(),
  secondaryColor: Joi.string().trim().allow("").optional(),

  operatingHours: Joi.array()
    .items(
      Joi.object({
        day: Joi.string().trim().required(),
        open: Joi.string().trim().allow(""),
        close: Joi.string().trim().allow(""),
        isClosed: Joi.boolean().default(false),
      })
    )
    .required(),

  appointmentSettings: Joi.object({
    allowOnlineBooking: Joi.boolean().default(true),
    maxAppointmentsPerDay: Joi.number().integer().min(1).optional(),
    cancellationHoursLimit: Joi.number().integer().min(0).optional(),
  }).required(),

  footerText: Joi.string().trim().allow("").optional(),
  privacyPolicy: Joi.string().trim().allow("").optional(),
  termsAndConditions: Joi.string().trim().allow("").optional(),

  updatedBy: Joi.any().optional(),

  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
  deletedAt: Joi.date().allow("").optional(),
});

export function modelSystemInfo(value) {
  const { error } = schemaSystemInfo.validate(value);

  if (error) {
    throw new Error(
      "Validation failed: " +
      error.details.map((d) => d.message).join(", ")
    );
  }

  return {
    _id: value._id ? new ObjectId(value._id) : new ObjectId(),

    clinicName: value.clinicName,
    tagline: value.tagline ?? "",
    description: value.description ?? "",

    email: value.email,
    phone: value.phone,
    address: value.address,

    logoUrl: value.logoUrl ?? "",
    faviconUrl: value.faviconUrl ?? "",

    primaryColor: value.primaryColor ?? "",
    secondaryColor: value.secondaryColor ?? "",

    operatingHours: value.operatingHours,

    appointmentSettings: value.appointmentSettings,

    footerText: value.footerText ?? "",
    privacyPolicy: value.privacyPolicy ?? "",
    termsAndConditions: value.termsAndConditions ?? "",

    updatedBy: value.updatedBy ? new ObjectId(value.updatedBy) : null,

    createdAt: value.createdAt ?? new Date(),
    updatedAt: value.updatedAt ?? "",
    deletedAt: value.deletedAt ?? "",
  };
}

