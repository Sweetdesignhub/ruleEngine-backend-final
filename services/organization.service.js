/**
 * File: organization.service.js
 * Description:
 *
 * Developed by: Arshdeep Singh
 * Developed on: 27-11-2024
 *
 * Updated by: [Name]
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import prisma from "../config/config.js";

/**
 * Soft delete an organization and its associated data
 * @param {string} organizationId - Organization ID
 * @returns {Promise<Object>}
 */
export const deleteOrganization = async (organizationId) => {
  const organization = await prisma.organization.findUnique({
    where: { id: parseInt(organizationId, 10) }, // Convert to integer
  });

  if (!organization) throw new Error("Organization not found");

  return prisma.organization.update({
    where: { id: parseInt(organizationId, 10) }, // Convert to integer
    data: {
      isDeleted: true,
      deletedAt: new Date(), // Track when the deletion happened
    },
  });
};


/**
 * Undo soft delete for an organization
 * @param {string} organizationId - Organization ID
 * @returns {Promise<Object>}
 */
export const undoDeleteOrganization = async (organizationId) => {
  const organization = await prisma.organization.findUnique({
    where: { id: parseInt(organizationId, 10) }, // Convert to integer
  });

  if (!organization) throw new Error("Organization not found");

  return prisma.organization.update({
    where: { id: parseInt(organizationId, 10) }, // Convert to integer
    data: {
      isDeleted: false,
      deletedAt: null, // Clear the deleted timestamp
    },
  });
};



/**
 * Check if the user has permission to delete the organization
 * @param {string} organizationId - Organization ID
 * @param {string} userId - User ID
 * @returns {Promise<boolean>}
 */
export const hasDeleteAccess = async (organizationId, userId) => {
  const organization = await prisma.organization.findUnique({
    where: { id: parseInt(organizationId, 10) }, // Convert to integer
    select: { ownerId: true, users: { where: { id: userId } } },
  });

  if (!organization) return false;

  // Allow delete if the user is the owner or has specific admin permissions
  return organization.ownerId === userId || organization.users.length > 0;
};

/**
 * Create a new organization
 */
export const createOrganization = async (data) => {
  return prisma.organization.create({
    data,
  });
};

/**
 * Update an organization
 */
export const updateOrganization = async (id, data) => {
  return prisma.organization.update({
    where: { id },
    data,
  });
};

/**
 * Get all organizations accessible to the user
 */
export const getOrganizationsByUser = async (userId) => {
  return prisma.organization.findMany({
    where: {
      OR: [{ ownerId: userId }, { users: { some: { id: userId } } }],
      isDeleted: false,
    },
  });
};

/**
 * Get an organization by ID, verifying user access
 */
export const getOrganizationById = async (id, userId) => {
  const organizationId = parseInt(id, 10);  // Ensure id is an integer
  
  console.log(organizationId);
  console.log(userId);

  return prisma.organization.findFirst({
    where: {
      id: organizationId,
      isDeleted: false,
      OR: [
        { ownerId: userId },
        { users: { some: { id: userId } } },
      ],
    },
  });
};
