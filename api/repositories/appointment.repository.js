import { ObjectId } from "mongodb";
import { db } from "../index.js";
import { schemaAppoinment, modelAppoinment, schemaAppoinmentStatusUpdateById } from "../models/appointment.model.js";
import { paginate } from "../utils/paginate.util.js";
import { logger } from "../utils/logger.util.js";

export function useAppointmentRepo() {
  const collection = db.collection("appointments");

  if (!db) {
    console.log("Mongodb client is required");
    logger.log({ level: "error", message: "Mongodb client is required" });
  }

  async function createAppointmentIndexes() {
    try {
      await collection.createIndexes([
        { key: { status: 1 } },
        {
          key: {
            fullName: "text",
            code: "text",
            email: "text",
            phone: "text",
            address: "text",
            petName: "text",
            petType: "text",
            petBreed: "text",
            petAge: "text",
            services: "text",
            date: "text",
            time: "text",
            status: "text",
          },
          name: "appointmentTextSearch",
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
    status,
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
      throw new Error("Failed to get appointments: " + error.message);
    }
  }

  async function getAllPendingAppointments({
    page = 1,
    limit = 10,
    status = "Pending",
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
      throw new Error("Failed to get pending appointments: " + error.message);
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
      value = modelAppoinment(value);
      await collection.insertOne(value);
      return "Successfully added appointment";
    } catch (error) {
      throw new Error("Failed to add appointment: " + error.message);
    }
  }

  async function updateById(id, value) {
    try {
      id = new ObjectId(id);
    } catch (error) {
      throw new Error("Invalid Id format");
    }

    const { error } = schemaAppoinment.validate(value);
    if (error) {
      throw new Error(
        "Validation failed: " + error.details.map((d) => d.message).join(", ")
      );
    }

    try {
      await collection.updateOne({ _id: id }, { $set: value });
      return "Successfully updated appointment";
    } catch (error) {
      logger.log({ level: "error", message: "Failed to update appointment: " + error.message });
      throw new Error("Failed to update appointment: " + error.message);
    }
  }

  async function updateStatusById(id, value) {
    try {
      id = new ObjectId(id);
    } catch (error) {
      throw new Error("Invalid Id format");
    }

    const { error } = schemaAppoinmentStatusUpdateById.validate(value);
    if (error) {
      throw new Error(
        "Validation failed: " + error.details.map((d) => d.message).join(", ")
      );
    }

    try {
      await collection.updateOne({ _id: id }, { $set: value });
      return "Successfully updated appointment status";
    } catch (error) {
      logger.log({ level: "error", message: "Failed to update appointment status: " + error.message });
      throw new Error("Failed to update appointment status: " + error.message);
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
          updatedAt: new Date(),
          deletedAt: new Date(),
        }
      });
      return "Successfully deleted appointment";
    } catch (error) {
      throw new Error("Failed to delete appointment: " + error.message);
    }
  }

  return { getAll, getAllPendingAppointments, getById, add, updateById, updateStatusById, deleteById, createAppointmentIndexes };
}