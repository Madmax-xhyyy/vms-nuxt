import { schemaSystemInfo } from "../models/system.info.model.js";
import { useSystemInfoRepo } from "../repositories/system.info.repository.js";

export function useSystemInfoController() {
  async function get(req, res) {
    try {
      const item = await useSystemInfoRepo().get();
      res.status(200).json(item);
      return;
    } catch (error) {
      res
        .status(500)
        .json({ message: error.message || "Failed to get system info" });
      return;
    }
  }

  async function upsert(req, res) {
    const value = req.body;
    const { error } = schemaSystemInfo.validate(value);
    if (error) {
      res
        .status(400)
        .json({ message: "Validation failed", errors: error.details });
      return;
    }

    try {
      const message = await useSystemInfoRepo().upsert(value);
      res.status(200).json({ message });
      return;
    } catch (error) {
      console.error("Error saving system info:", error);
      res
        .status(500)
        .json({ message: error.message || "Failed to save system info" });
      return;
    }
  }

  return { get, upsert };
}
