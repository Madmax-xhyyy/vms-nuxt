import Joi from "joi";

export const schemaProduct = Joi.object({
  _id: Joi.string().hex().length(24).required(),
  name: Joi.string().trim().min(1).max(200).required(),
  price: Joi.number().required(),
  category: Joi.string().trim().min(1).max(200).required(),
  stock: Joi.number().required(),
  image: Joi.string().trim().min(1).max(200).required(),
  status: Joi.string().trim().max(200).optional().allow("", null),
  createdAt: Joi.date().required(),
});

export const schemaProductUpdateById = Joi.object({
  _id: Joi.string().hex().length(24).required(),
  name: Joi.string().trim().min(1).max(200).required(),
  price: Joi.number().required(),
  category: Joi.string().trim().min(1).max(200).required(),
  stock: Joi.number().required(),
  image: Joi.string().trim().min(1).max(200).required(),
  status: Joi.string().trim().max(200).optional().allow("", null),
  updatedAt: Joi.date().required(),
});

export const schemaProductUpdateStockById = Joi.object({
  _id: Joi.string().hex().length(24).required(),
  stock: Joi.number().required(),
  updatedAt: Joi.date().required(),
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
    _id: value._id,
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
