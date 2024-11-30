/**
 * File: app.js
 * Description:
 *
 * Developed by: Arshdeep Singh
 * Developed on: 27-11-2024
 *
 * Updated by: [Name] 
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

//routes
import authRoutes from "./routes/auth.route.js";
import ruleRoutes from "./routes/rule.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

// Default route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/rules", ruleRoutes);

export { app };
