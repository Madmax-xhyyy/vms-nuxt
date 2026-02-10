import { ObjectId } from "mongodb";
import { db } from "../index.js";
import { schemaProduct, modelProduct, schemaProductUpdateStockById, schemaProductUpdateById } from "../models/product.model.js";
import { paginate } from "../utils/paginate.util.js";
import { logger } from "../utils/logger.util.js";

export function useProductRepo() {
  const collection = db.collection("products");

  if (!db) {
    console.log("Mongodb client is required");
    logger.log({ level: "error", message: "Mongodb client is required" });
  }

  async function createProductIndexes() {
    try {
      await collection.createIndexes([
        { key: { status: 1 } },
        {
          key: {
            name: "text",
            stock: "text",
            image: "text",
            status: "text",
          },
          name: "productTextSearch",
        },
      ]);
      return "Indexes created successfully.";
    } catch (error) {
      throw new Error("Failed to create indexes: " + error.message);
    }
  }

  async function getAll({
    page = 1,
    limit = 10,
    status = "active",
    search = "",
  } = {}) {
    page = page > 0 ? page - 1 : page;

    const query = { status };

    if (search) {
      query.$text = { $search: search };
    }
    try {
      const items = await collection
        .aggregate([
          {
            $match: query,
          },
          {
            $sort: { createdAt: -1 },
          },
          {
            $skip: page * limit,
          },
          {
            $limit: limit,
          },
        ])
        .toArray();

      const length = await collection.countDocuments(query);
      return paginate({ items, page, limit, length });
    } catch (error) {
      throw new Error("Failed to get products: " + error.message);
    }
  }

  async function getById(id) {
    try {
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw new Error("Failed to get id: " + error.message);
    }
  }

  async function add(value) {
    try {
      value = modelProduct(value);
      await collection.insertOne(value);
      return "Successfully added product";
    } catch (error) {
      throw new Error("Failed to add product: " + error.message);
    }
  }

  async function updateById(id, value) {
    try {
      id = new ObjectId(id);
    } catch (error) {
      throw new Error("Invalid Id format");
    }

    const { error } = schemaProductUpdateById.validate(value);
    if (error) {
      throw new Error(
        "Validation failed: " + error.details.map((d) => d.message).join(", ")
      );
    }

    // Prevent updating immutable field _id
    delete value._id;

    try {
      await collection.updateOne({ _id: id }, { $set: value });
      return "Successfully updated product";
    } catch (error) {
      throw new Error("Failed to update product: " + error.message);
    }
  }

  async function updateStockById(id, value) {
    try {
      id = new ObjectId(id);
    } catch (error) {
      throw new Error("Invalid Id format");
    }

    const { error } = schemaProductUpdateStockById.validate(value);
    if (error) {
      throw new Error(
        "Validation failed: " + error.details.map((d) => d.message).join(", ")
      );
    }

    try {
      await collection.updateOne({ _id: id }, { $set: value });
      return "Successfully updated product stock";
    } catch (error) { }
  }

  async function deleteById(id) {
    try {
      id = new ObjectId(id);
    } catch (error) {
      throw new Error("Invalid Id format");
    }

    try {
      await collection.updateOne({ _id: id }, {
        $set: {
          status: "deleted",
          updatedAt: new Date(),
          deletedAt: new Date(),
        }
      });
      return "Successfully deleted product";
    } catch (error) {
      throw new Error("Failed to delete product: " + error.message);
    }
  }

  async function getCount() {
    try {
      return await collection.countDocuments({ status: { $ne: "deleted" } });
    } catch (error) {
      throw new Error("Failed to get product count: " + error.message);
    }
  }

  return { getAll, getById, add, updateById, updateStockById, deleteById, createProductIndexes, getCount };
}