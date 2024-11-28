/**
 * File: index.js
 * Description:
 *
 * Developed by: Arshdeep Singh
 * Developed on: 27-11-2024
 *
 * Updated by: [Name] 
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import dotenv from "dotenv";
import http from "http";
import { app } from "./app.js";
import { connectDB } from "./db/prisma.js";

dotenv.config();

const PORT = process.env.PORT || 8080;

// Start the server and connect to the database
const startServer = async () => {
  try {
    // Connect to the database before starting the server
    await connectDB();

    // If DB connection is successful, start the server
    const server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`⚙️ Server is running at http://localhost:${PORT}`);
    });

    process.on("SIGINT", () => {
      console.log("🛑 Gracefully shutting down the server...");
      server.close(() => {
        console.log("🔒 Server has been shut down.");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Failed to start the server:", error.message);
    process.exit(1);
  }
};

startServer();
