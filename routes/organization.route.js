import { Router } from "express";
import {
  createOrg,
  deleteOrg,
  getOrgById,
  getOrgs,
  undoDeleteOrg,
  updateOrg,
} from "../controllers/organization.controller";
import { authenticate, isAdmin } from "../middlewares/auth.middleware";

const router = Router();

// Routes for organizations
router.post("/", authenticate, isAdmin, createOrg); // Create organization
router.put("/:id", authenticate, isAdmin, updateOrg); // Update organization
router.delete("/:id", authenticate, isAdmin, deleteOrg); // Soft delete organization
router.post("/:id/undo", authenticate, isAdmin, undoDeleteOrg); // Undo delete
router.get("/", authenticate, getOrgs); // View organizations
router.get("/:id", authenticate, getOrgById); // Get organization by ID


export default router;
