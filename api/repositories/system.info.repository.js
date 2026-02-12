import { ObjectId } from "mongodb";
import { db } from "../index.js";
import { schemaSystemInfo, modelSystemInfo } from "../models/system.info.model.js";
import { logger } from "../utils/logger.util.js";

export function useSystemInfoRepo() {
  const collection = db.collection("system.info");

  if (!db) {
    console.log("Mongodb client is required");
    logger.log({ level: "error", message: "Mongodb client is required" });
  }

  async function createSystemInfoIndexes() {
    try {
      await collection.createIndexes([
        { key: { status: 1 } },
        {
          key: {
            clinicName: "text",
            email: "text",
            status: "text",
          },
          name: "systemInfoTextSearch",
        },
      ]);
      return "Indexes created successfully.";
    } catch (error) {
      throw new Error("Failed to create indexes: " + error.message);
    }
  }

  async function get() {
    try {
      return await collection.findOne({});
    } catch (error) {
      throw new Error("Failed to get system info: " + error.message);
    }
  }

  async function upsert(value) {
    const { error } = schemaSystemInfo.validate(value);
    if (error) {
      throw new Error(
        "Validation failed: " + error.details.map((d) => d.message).join(", ")
      );
    }

    // Remove _id from update payload
    delete value._id;

    try {
      const existing = await collection.findOne({});

      if (existing) {
        // Update existing
        await collection.updateOne(
          { _id: existing._id },
          { $set: { ...value, updatedAt: new Date() } }
        );
        return "Successfully updated system info";
      } else {
        // Insert new
        const newValue = modelSystemInfo(value);
        await collection.insertOne(newValue);
        return "Successfully created system info";
      }
    } catch (error) {
      throw new Error("Failed to save system info: " + error.message);
    }
  }

  return { get, upsert };
}
