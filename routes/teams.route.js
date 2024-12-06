import { Router } from "express";
import { authenticate, isAdmin } from "../middlewares/auth.middleware";
import { createTeamHandler, deleteTeamHandler, hardDeleteTeamHandler, undoDeleteTeamHandler, updateTeamHandler } from "../controllers/teams.controller";


const router = Router();

/**
 * Admin-only routes
 */
router.post("/create", authenticate, isAdmin, createTeamHandler);
router.put("/:id", authenticate, isAdmin, updateTeamHandler);
router.delete("/:id", authenticate, isAdmin, deleteTeamHandler);
router.post("/:id/undo", authenticate, isAdmin, undoDeleteTeamHandler);
router.delete("/:id/hard", authenticate, isAdmin, hardDeleteTeamHandler);

/**
 * Get teams accessible to the user
 */
router.get("/:organizationId", authenticate, getTeamsHandler);
router.get("/team/:id", authenticate, getTeamByIdHandler);

export default router;
