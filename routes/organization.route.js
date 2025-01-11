/**
 * File: organization.route.js
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
  createOrg,
  updateOrg,
  getOrgs,
  getOrgById,
  deleteOrg,
  undoDeleteOrg,
} from "../controllers/organization.controller.js";
import { authenticate, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Routes for organizations
router.post("/create", authenticate, isAdmin, createOrg); // Create organization
router.put("/update/:id", authenticate, isAdmin, updateOrg); // Update organization
router.get("/getAll", authenticate, getOrgs); // View organizations
router.get("/:id", authenticate, getOrgById); // Get organization by ID
router.delete("/delete/:id", authenticate, isAdmin, deleteOrg); // Delete an organization
router.post("/delete/undo/:id", authenticate, isAdmin, undoDeleteOrg); // Undo delete an organization


export default router;
