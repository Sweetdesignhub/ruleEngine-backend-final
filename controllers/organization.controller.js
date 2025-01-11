/**
 * File: organization.controller.js
 * Description:
 *
 * Developed by: Arshdeep Singh
 * Developed on: 27-11-2024
 *
 * Updated by: [Name]
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import {
  createOrganization,
  getOrganizationById,
  getOrganizationsByUser,
  updateOrganization,
  deleteOrganization,
  undoDeleteOrganization,
  hasDeleteAccess
} from "../services/organization.service.js";

/**
 * Create a new organization
 */
export const createOrg = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const data = {
      name,
      description,
      ownerId: req.user.id,
    };
    

    const organization = await createOrganization(data);
    res.status(201).json({ success: true, data: organization });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an organization
 */
export const updateOrg = async (req, res, next) => {
  try {
    let { id } = req.params;
    const { name, description } = req.body;

    // Ensure id is an integer
    id = parseInt(id, 10); // Converts id to an integer

    // Validate that at least one field is provided
    if (!name && !description) {
      return res.status(400).json({
        success: false,
        error: "At least one field (name or description) must be provided for update.",
      });
    }

    // Build update data dynamically
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    // Update organization
    const organization = await updateOrganization(id, updateData);

    res.status(200).json({ success: true, data: organization });
  } catch (error) {
    next(error);
  }
};

/**
 * Get organizations accessible to the user
 */
export const getOrgs = async (req, res, next) => {
  try {
    const organizations = await getOrganizationsByUser(req.user.id);
    res.status(200).json({ success: true, data: organizations });
  } catch (error) {
    next(error);
  }
};

/**
 * Get an organization by ID, verifying user access
 */
export const getOrgById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const organization = await getOrganizationById(id, req.user.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: "Organization not found or access denied.",
      });
    }

    res.status(200).json({ success: true, data: organization });
  } catch (error) {
    next(error);
  }
};


/**
 * Delete an organization
 */
export const deleteOrg = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Convert `id` to integer
    const orgId = parseInt(id, 10);

    // Check if the user has delete access
    const canDelete = await hasDeleteAccess(orgId, userId);
    if (!canDelete) {
      return res.status(403).json({
        success: false,
        message: "You do not have the required permissions to delete this organization.",
      });
    }

    // Proceed with deletion
    const organization = await deleteOrganization(orgId);

    // After successful deletion, send a message that includes the "Undo" option
    res.status(200).json({
      success: true,
      message: "Organization deleted. Undo?",
      data: organization,
    });
  } catch (error) {
    next(error);
  }
};


/**
 * Undo delete action for an organization
 */
export const undoDeleteOrg = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Attempt to undo the soft delete
    const organization = await undoDeleteOrganization(id);
    
    res.status(200).json({
      success: true,
      message: "Undo successful. Organization restored.",
      data: organization,
    });
  } catch (error) {
    next(error);
  }
};
