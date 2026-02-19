import express from "express";
import { db } from "../index.js";
import { ObjectId } from "mongodb";

export default function useNotificationRoute() {
  const router = express.Router();

  // Get all notifications
  router.get("/", async (req, res) => {
    const notifications = await db.collection("notifications")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.json(notifications);
  });

  // Get unread count
  router.get("/unread-count", async (req, res) => {
    const count = await db.collection("notifications").countDocuments({
      isRead: false
    });

    res.json({ count });
  });

  // Mark as read
  router.patch("/:id/read", async (req, res) => {
    await db.collection("notifications").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { isRead: true } }
    );

    res.json({ message: "Marked as read" });
  });

  return router;
}
