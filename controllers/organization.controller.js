import {
  createOrganization,
  getOrganizationById,
  getOrganizationsByUser,
  restoreOrganization,
  softDeleteOrganization,
  updateOrganization,
} from "../services/organization.service";

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
    const { id } = req.params;
    const { name, description } = req.body;

    const organization = await updateOrganization(id, { name, description });
    res.status(200).json({ success: true, data: organization });
  } catch (error) {
    next(error);
  }
};

/**
 * Soft delete an organization
 */
export const deleteOrg = async (req, res, next) => {
  try {
    const { id } = req.params;

    const organization = await softDeleteOrganization(id);
    res.status(200).json({
      success: true,
      message: "Organization deleted. Undo available for 10 seconds.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Undo delete an organization
 */
export const undoDeleteOrg = async (req, res, next) => {
  try {
    const { id } = req.params;

    const organization = await restoreOrganization(id);
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