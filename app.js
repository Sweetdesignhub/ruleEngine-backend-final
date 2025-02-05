/**
 * File: app.js
 * Description:
 *
 * Developed by: Arshdeep Singh
 * Developed on: 27-11-2024
 *
 * Updated by: [Name]
 * Updated on: [Update date]
 * - Update description: Configured CORS to allow requests from the deployed frontend URL
 */

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

//routes
import authRoutes from "./routes/auth.route.js";
import ruleRoutes from "./routes/rule.route.js";
import orgRoutes from "./routes/organization.route.js";
import teamRoutes from "./routes/teams.route.js";
import userRoutes from "./routes/user.route.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS
const allowedOrigins = [
  "http://localhost:5173", // Allow requests from your local frontend
  "https://feature-rule-management.d3ndpxz9084dn8.amplifyapp.com", // Uncomment this line if you want to allow production frontend
  "https://beta.d3ndpxz9084dn8.amplifyapp.com",
  "https://beta.d68sn7l1f573h.amplifyapp.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(morgan("dev"));
app.options("*", cors()); // Handle preflight OPTIONS requests

// Default route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});
// Serve static files from the uploads directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/api/v1/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/org", orgRoutes);
app.use("/api/v1/teams", teamRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/rules", ruleRoutes);
app.use("/api/v1/users", userRoutes);

export { app };
