import Joi from "joi";
import { ObjectId } from "mongodb";

export const schemaProduct = Joi.object({
  _id: Joi.any().optional(),
  name: Joi.string().trim().min(1).max(200).required(),
  price: Joi.number().required(),
  category: Joi.string().trim().min(1).max(200).required(),
  stock: Joi.number().required(),
  image: Joi.string().optional().allow("", null),
  status: Joi.string().trim().max(200).optional().allow("", null),
  createdAt: Joi.date().optional(),
});

export const schemaProductUpdateById = Joi.object({
  _id: Joi.any().optional(),
  name: Joi.string().trim().min(1).max(200).required(),
  price: Joi.number().required(),
  category: Joi.string().trim().min(1).max(200).required(),
  stock: Joi.number().required(),
  image: Joi.string().optional(),
  status: Joi.string().trim().max(200).optional().allow("", null),
  updatedAt: Joi.date().optional(),
});

export const schemaProductUpdateStockById = Joi.object({
  _id: Joi.any().optional(),
  stock: Joi.number().required(),
  updatedAt: Joi.date().optional(),
});

export function modelProduct(value) {
  const { error } = schemaProduct.validate(value);

  if (error) {
    throw new Error(
      "Validation failed: " + error.details.map((d) => d.message).join(", "
      )
    );
  }

  return {
    _id: value._id ? new ObjectId(value._id) : new ObjectId(),
    name: value.name,
    price: value.price,
    category: value.category,
    stock: value.stock,
    image: value.image,
    status: value.status ?? "active",
    createdAt: value.createdAt ?? new Date(),
    updatedAt: value.updatedAt,
    deletedAt: value.deletedAt,
  };
}
