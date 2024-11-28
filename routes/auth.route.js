/**
 * File: auth.route.js
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
import {
  refreshToken,
  registerUser,
  signIn,
  signOut,
  verifyEmail,
} from "../controllers/auth.controller.js";

const router = Router();

// User registration route
router.post("/sign-up", registerUser);
router.get("/verify-email", verifyEmail);
router.post("/sign-in", signIn);
router.post("/refresh-token", refreshToken);
router.post("/sign-out", signOut);

export default router;
