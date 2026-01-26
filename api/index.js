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
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Health Check Route
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "API is running" });
});


// Routes Import
import useAuthRoute from "./routes/auth.route.js";
import useProductRoute from "./routes/product.route.js";
import useAppointmentRoute from "./routes/appointment.route.js";
export let db;

import setup from "./setup.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { logger } from "./utils/logger.util.js";




// Database Export & Setup Script
connectToDB().then(async () => {
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

