import { ObjectId } from "mongodb";
import { db } from "../index.js";
import { logger } from "../utils/logger.util.js";
import { paginate } from "../utils/paginate.util.js";

export function usePatientRecordRepo() {
  const collection = db.collection("patient.records");

  if (!db) {
    console.log("Mongodb client is required");
    logger.log({ level: "error", message: "Mongodb client is required" });
  }

  // 🔍 Find patient record by owner email
  async function findByEmail(email) {
    try {
      return await collection.findOne({ ownerEmail: email });
    } catch (error) {
      throw new Error("Failed to find patient record by email: " + error.message);
    }
  }

  // 🔍 Get patient record by ID
  async function getById(id) {
    try {
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw new Error("Failed to get patient record by id: " + error.message);
    }
  }

  // ➕ Add new patient record
  async function add(value) {
    try {
      await collection.insertOne(value);
      return "Successfully added patient record";
    } catch (error) {
      logger.log({
        level: "error",
        message: "Failed to add patient record: " + error.message,
      });
      throw new Error("Failed to add patient record: " + error.message);
    }
  }

  // ✏️ Update existing patient record
  async function update(value) {
    try {
      await collection.updateOne(
        { _id: new ObjectId(value._id) },
        {
          $set: {
            ...value,
            updatedAt: new Date(),
          },
        }
      );
      return "Successfully updated patient record";
    } catch (error) {
      logger.log({
        level: "error",
        message: "Failed to update patient record: " + error.message,
      });
      throw new Error("Failed to update patient record: " + error.message);
    }
  }

  async function getAll({
    page = 1,
    limit = 10,
    status,
    search = "active",
  } = {}) {
    page = page > 0 ? page - 1 : page;

    const query = {};
    if (status) {
      query.status = status;
    }

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
      throw new Error("Failed to get patient records: " + error.message);
    }
  }

  async function createPatientRecordIndexes() {
    try {
      await collection.createIndexes([
        { key: { ownerEmail: 1 }, unique: true },
        {
          key: {
            ownerName: "text",
            ownerEmail: "text",
            "pets.petName": "text",
            "pets.petType": "text",
            "pets.petBreed": "text",
          },
          name: "patientRecordTextSearch",
        },
      ]);
      return "Patient record indexes created successfully";
    } catch (error) {
      throw new Error("Failed to create patient record indexes: " + error.message);
    }
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
          deletedAt: new Date(),
        }
      });
      return "Successfully deleted patient record";
    } catch (error) {
      throw new Error("Failed to delete patient record: " + error.message);
    }
  }
  return {
    findByEmail,
    getById,
    add,
    update,
    getAll,
    createPatientRecordIndexes,
    deleteById,
  };
}
