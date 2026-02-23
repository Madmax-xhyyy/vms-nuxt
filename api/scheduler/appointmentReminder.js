import cron from "node-cron";
import { ObjectId } from "mongodb";
import { modelNotification } from "../models/notification.model.js";
import { db } from "../index.js";

cron.schedule("* * * * *", async () => {
  if (!db) return;

  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  try {
    const appointments = await db.collection("appointments").find({
      status: "Approved",
      dateTime: { $gte: now, $lte: oneHourLater }
    }).toArray();

    if (appointments.length > 0) {
      console.log(`[Scheduler] Found ${appointments.length} upcoming approved appointments.`);
    }

    for (const appointment of appointments) {
      const existing = await db.collection("notifications").findOne({
        appointmentId: new ObjectId(appointment._id)
      });

      if (!existing) {
        const notification = modelNotification({
          title: "Upcoming Appointment",
          message: `Appointment with ${appointment.petName} in 1 hour.`,
          appointmentId: appointment._id.toString(),
        });

        await db.collection("notifications").insertOne(notification);
        console.log(`[Scheduler] Created notification for appointment: ${appointment._id}`);
      }
    }

  } catch (err) {
    console.error("Cron Error:", err);
  }
});
