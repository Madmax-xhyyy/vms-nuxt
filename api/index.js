// Header - Import all required dependencies
import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

// App Config - Initialize Express application
const app = express();
app.use(cookieParser());

import { MONGO_URI, MONGO_DB } from "./config.js";

// Database Connection
const client = new MongoClient(MONGO_URI);
async function connectToDB() {
  await client.connect();
  console.log("✅ Connected to MongoDB");
}


// Middleware Pipeline
app.use(cors({
  origin: "https://fureverclinic.vercel.app",
  credentials: true
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Health Check Route
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});


// Routes Import
import "./scheduler/appointmentReminder.js";
import useAuthRoute from "./routes/auth.route.js";
import useProductRoute from "./routes/product.route.js";
import useAppointmentRoute from "./routes/appointment.route.js";
import usePatientRecordRoute from "./routes/patient.record.route.js";
import useUploadRoute from "./routes/upload.route.js";
import useSystemInfoRoute from "./routes/system.info.route.js";
import useUserRoute from "./routes/user.route.js";
import useNotificationRoute from "./routes/notification.route.js";
export let db;

import setup from "./setup.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { logger } from "./utils/logger.util.js";


// Database Export & Setup Script
connectToDB().then(async () => {
  console.log(`[Database] Connecting to: ${MONGO_DB}`);
  db = client.db(MONGO_DB);

  try {
    await setup();
    console.log("Successfully ran setup script");
  } catch (error) {
    console.error("Failed to run setup script:", error.message);
  }

  // Authentication Routes
  app.use("/api/auth", useAuthRoute());

  // After authentication routes, add:
  app.use("/api/appointments", useAppointmentRoute());
  app.use("/api/products", useProductRoute());
  app.use("/api/patient-records", usePatientRecordRoute());
  app.use("/api/upload", useUploadRoute());
  app.use("/api/system-info", useSystemInfoRoute());
  app.use("/api/user", useUserRoute());
  app.use("/api/notifications", useNotificationRoute());

  // Error handling middleware (must be last)
  app.use(errorHandler);

  // Server Startup
  const LISTEN_PORT = process.env.PORT || 5000;

  app.listen(LISTEN_PORT, () => {
    console.log(`🚀 Server running at http://localhost:${LISTEN_PORT}`);
    logger.log({
      level: "info",
      message: `🚀 Server running at http://localhost:${LISTEN_PORT}`,
    });
  });

});

