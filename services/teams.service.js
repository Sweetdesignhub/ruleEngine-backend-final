import prisma from "../prismaClient.js";

/**
 * Create a team
 */
export const createTeam = async (data) => {
  return prisma.teams.create({
    data,
  });
};

/**
 * Update a team
 */
export const updateTeam = async (id, data) => {
  return prisma.teams.update({
    where: { id },
    data,
  });
};

/**
 * Get all teams in an organization
 */
export const getTeamsByOrganization = async (organizationId) => {
  return prisma.teams.findMany({
    where: {
      organizationId,
      isDeleted: false,
    },
    include: {
      users: true, // Include team members in the response
    },
  });
};

/**
 * Get a team by ID
 */
export const getTeamById = async (id, userId) => {
  return prisma.teams.findFirst({
    where: {
      id,
      isDeleted: false,
      OR: [{ ownerId: userId }, { users: { some: { id: userId } } }],
    },
    include: {
      users: true,
    },
  });
};

/**
 * Soft delete a team
 */
export const softDeleteTeam = async (id) => {
  return prisma.teams.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });
};

/**
 * Restore a soft-deleted team
 */
export const restoreTeam = async (id) => {
  return prisma.teams.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  });
};

/**
 * Permanently delete a team (hard delete)
 */
export const hardDeleteTeam = async (id) => {
  try {
    return await prisma.teams.delete({
      where: { id },
    });
  } catch (error) {
    console.error(`Error during hard deletion of team ID: ${id}`, error);
    throw new Error("Failed to hard delete team.");
  }
};
