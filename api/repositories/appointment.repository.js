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
      // Drop the old text index if it exists (e.g. after schema changes)
      try {
        await collection.dropIndex("appointmentTextSearch");
      } catch (_) {
        // Index may not exist yet — that's fine
      }

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
            dateTime: "text",
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

  async function getAppointmentStatusCounts() {
    return collection
      .aggregate([
        {
          $match: { status: { $ne: "deleted" } },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();
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

    const { error, value: validatedValue } = schemaAppoinment.validate(value);
    if (error) {
      throw new Error(
        "Validation failed: " + error.details.map((d) => d.message).join(", ")
      );
    }

    try {
      // Use validatedValue to ensure dateTime is a Date object
      await collection.updateOne({ _id: id }, { $set: validatedValue });
      return "Successfully updated appointment";
    } catch (error) {
      logger.log({ level: "error", message: "Failed to update appointment: " + error.message });
      throw new Error("Failed to update appointment: " + error.message);
    }
  }

  async function updateStatusById(id, status) {
    const { error } = schemaAppoinmentStatusUpdateById.validate({
      status: status,
    });
    if (error) {
      throw new Error(
        "Validation failed: " + error.details.map((d) => d.message).join(", ")
      );
    }

    try {
      await collection.updateOne({ _id: new ObjectId(id) }, {
        $set: {
          status: status,
          updatedAt: new Date(),
        },
      });
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
          deletedAt: new Date(),
        }
      });
      return "Successfully deleted appointment";
    } catch (error) {
      throw new Error("Failed to delete appointment: " + error.message);
    }
  }

  async function getBusySlotsByDate(dateStr) {
    try {
      // dateStr is YYYY-MM-DD from client
      const [year, month, day] = dateStr.split("-").map(Number);

      // Query a wide window (+/- 24h) to cover all possible timezone offsets
      // and ensure we don't miss appointments near day boundaries.
      const targetDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));

      const start = new Date(targetDate);
      start.setUTCDate(start.getUTCDate() - 1); // 24h before

      const end = new Date(targetDate);
      end.setUTCDate(end.getUTCDate() + 2); // 48h window total

      const appointments = await collection.find({
        status: { $in: ["Pending", "Approved"] },
        dateTime: {
          $gte: start,
          $lte: end
        }
      }).project({ dateTime: 1 }).toArray();

      logger.info(`Fetching busy slots for ${dateStr}: found ${appointments.length} slots`);
      return appointments.map(a => a.dateTime);
    } catch (error) {
      throw new Error("Failed to get busy slots: " + error.message);
    }
  }

  return { getAll, getAllPendingAppointments, getById, add, updateById, updateStatusById, getAppointmentStatusCounts, deleteById, createAppointmentIndexes, getBusySlotsByDate };
}