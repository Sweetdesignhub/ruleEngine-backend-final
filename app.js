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
import cookieParser from 'cookie-parser';

//routes
import authRoutes from "./routes/auth.route.js";
import ruleRoutes from "./routes/rule.route.js";
import organizationRoutes from "./routes/organization.route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS
const allowedOrigins = [
   "http://localhost:5173", // Allow requests from your local frontend
  "https://feature-rule-management.d3ndpxz9084dn8.amplifyapp.com", // Uncomment this line if you want to allow production frontend
  "https://beta.d3ndpxz9084dn8.amplifyapp.com"
];


app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // Allow cookies or other credentials
    optionsSuccessStatus: 204,
    allowedHeaders: 'Content-Type, Authorization',
  })
);

// app.use(
//   cors({
//     origin: allowedOrigins,
//     methods: 'GET,POST,PUT,DELETE',
//     credentials: true,
//     optionsSuccessStatus: 204,
//     allowedHeaders: 'Content-Type, Authorization',
//   })
// );
app.use(morgan("dev"));
app.use(cookieParser());

// Default route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Server is up and running!" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/rules", ruleRoutes);
app.use("/api/v1/organizations", organizationRoutes);

export { app };
