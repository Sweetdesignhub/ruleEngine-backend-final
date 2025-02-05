/**
 * File: user.route.js
 * Description:
 *
 * Developed by: Arshdeep Singh
 * Developed on: 27-11-2024
 *
 * Updated by: [Name] 
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */
import { Router } from "express";
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js";
import { fetchAllUsers } from "../controllers/user.controller.js";
const router = Router();

router.get("/", authenticate, fetchAllUsers);

export default router;