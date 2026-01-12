process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";

import AppError from "./utils/AppError.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// MongoDB Connection
connectDB();

app.get("/", (req, res) => {
  res.send("Backend Is Running");
});

app.get("/health", (req, res) => {
  res.send("Backend Is Running");
});

// Handle undefined Routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful Shutdown Logic
const gracefulShutdown = async () => {
  console.log("Received kill signal, shutting down gracefully");
  server.close(async () => {
    console.log("Closed out remaining connections");
    try {
      await mongoose.connection.close(false);
      console.log("MongoDb connection closed");
      process.exit(0);
    } catch (err) {
      console.error("Error closing MongoDB connection", err);
      process.exit(1);
    }
  });

  // Force close server after 10 secs
  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

export default app;
