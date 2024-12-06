import { createTeam, getTeamById, getTeamsByOrganization, hardDeleteTeam, restoreTeam, softDeleteTeam, updateTeam } from "../services/teams.service";

  
  /**
   * Create a new team
   */
  export const createTeamHandler = async (req, res, next) => {
    try {
      const { name, description, organizationId } = req.body;
      const data = {
        name,
        description,
        organizationId,
        ownerId: req.user.id, // Admin creates the team
      };
  
      const team = await createTeam(data);
      res.status(201).json({ success: true, data: team });
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Update a team
   */
  export const updateTeamHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
  
      const team = await updateTeam(id, { name, description });
      res.status(200).json({ success: true, data: team });
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Get all teams for a specific organization
   */
  export const getTeamsHandler = async (req, res, next) => {
    try {
      const { organizationId } = req.params;
      const teams = await getTeamsByOrganization(organizationId);
      res.status(200).json({ success: true, data: teams });
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Get a team by ID with access control
   */
  export const getTeamByIdHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const team = await getTeamById(id, req.user.id);
  
      if (!team) {
        return res.status(404).json({
          success: false,
          error: "Team not found or access denied.",
        });
      }
  
      res.status(200).json({ success: true, data: team });
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Soft delete a team
   */
  export const deleteTeamHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const team = await softDeleteTeam(id);
      res.status(200).json({
        success: true,
        message: "Team deleted. Undo available for 10 seconds.",
      });
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Undo delete a team
   */
  export const undoDeleteTeamHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const team = await restoreTeam(id);
      res.status(200).json({ success: true, data: team });
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Hard delete a team
   */
  export const hardDeleteTeamHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      await hardDeleteTeam(id);
      res.status(200).json({ success: true, message: "Team permanently deleted." });
    } catch (error) {
      next(error);
    }
  };
  