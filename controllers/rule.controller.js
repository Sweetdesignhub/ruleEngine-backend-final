/**
 * File: 
 * Description:
 *
 * Developed by: Harish
 * Developed on: 29-11-2024
 *
 * Updated by: [Name] 
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */


// const authenticate = (req, res, next) => {
//     req.user = { email: 'user@example.com' }; // Mock user object
//     next();
//   };

import { PrismaClient } from '@prisma/client';  // Make sure you have @prisma/client installed
const prisma = new PrismaClient();


// Error handling
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

class ApiResponse {
  constructor(status, data, message) {
    this.status = status;
    this.data = data;
    this.message = message;
  }
}

function asyncHandler(fn) {
  return function (req, res, next) {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
}


// In-memory data for demo purposes
// const data = []; 

// export const getAllRuleByOrgId = asyncHandler(async (req, res) => {
//   const orgId = req.params.orgId;

//   if (!orgId) {
//     throw new ApiError(400, "Organization ID is required");
//   }

//   const rules = data.filter(rule => rule.OrganizationId === orgId);

//   const categories = ["hr", "logistics", "security", "finance", "operations"];
//   const categoryCounts = categories.reduce((acc, category) => {
//     acc[category] = 0;
//     return acc;
//   }, {});

//   rules.forEach(rule => {
//     if (categories.includes(rule.category)) {
//       categoryCounts[rule.category]++;
//     }
//   });

//   const totalRules = rules.length;

//   res.status(200).json(new ApiResponse(200, { rules, categoryCounts, totalRules }, "Rules fetched successfully"));
// });

// export const createRuleByOrgId = asyncHandler(async (req, res) => {
//   const orgId = req.params.orgId;
//   const rule = req.body;

//   if (!rule.name || !rule.description || !rule.data || !rule.category || !rule.ruleType) {
//     throw new ApiError(400, "Please provide all required fields");
//   }

//   const validCategories = ["hr", "logistics", "security", "finance", "operations"];
//   const validRuleTypes = ["SHORT_RULE", "LONG_RULE"];

//   if (!validCategories.includes(rule.category)) {
//     throw new ApiError(400, "Invalid category provided");
//   }

//   if (!validRuleTypes.includes(rule.ruleType)) {
//     throw new ApiError(400, "Invalid ruleType provided");
//   }

//   const newRule = {
//     id: Math.random().toString(36).substring(2, 15),
//     name: rule.name,
//     description: rule.description,
//     email: req.user.email || null,
//     data: rule.data,
//     flowInput: rule.flowInput || null,
//     secret: Math.random().toString(36).substring(2, 15),
//     status: "ACTIVE",
//     ruleType: rule.ruleType,
//     activationDate: new Date().toISOString(),
//     category: rule.category,
//     versions: rule.versions || "1.0",
//     OrganizationId: orgId,
//   };

//   const existingRule = data.find(r => r.name === newRule.name && r.OrganizationId === orgId);
//   if (existingRule) {
//     throw new ApiError(400, "Rule with this name already exists for this organization");
//   }

//   data.push(newRule);

//   res.status(201).json(new ApiResponse(201, newRule, "Rule created successfully"));
// });

// export const editRuleById = asyncHandler(async (req, res) => {
//   const { orgId, id } = req.params;
//   const updatedRuleData = req.body;

//   const ruleIndex = data.findIndex(r => r.id === id && r.OrganizationId === orgId);
//   if (ruleIndex === -1) {
//     throw new ApiError(404, "Rule not found");
//   }

//   const validCategories = ["hr", "logistics", "security", "finance", "operations"];
//   const validRuleTypes = ["SHORT_RULE", "LONG_RULE"];
//   const validStatuses = ["ACTIVE", "INACTIVE"];

//   if (updatedRuleData.category && !validCategories.includes(updatedRuleData.category)) {
//     throw new ApiError(400, "Invalid category provided");
//   }

//   if (updatedRuleData.ruleType && !validRuleTypes.includes(updatedRuleData.ruleType)) {
//     throw new ApiError(400, "Invalid ruleType provided");
//   }

//   if (updatedRuleData.status && !validStatuses.includes(updatedRuleData.status)) {
//     throw new ApiError(400, "Invalid status provided");
//   }

//   const updatedRule = {
//     ...data[ruleIndex],
//     ...updatedRuleData,
//     updatedDate: new Date().toISOString(),
//   };

//   data[ruleIndex] = updatedRule;

//   res.status(200).json(new ApiResponse(200, updatedRule, "Rule updated successfully"));
// });

// export const deleteRuleById = asyncHandler(async (req, res) => {
//   const { orgId, id } = req.params;

//   const ruleIndex = data.findIndex(r => r.id === id && r.OrganizationId === orgId);
//   if (ruleIndex === -1) {
//     throw new ApiError(404, "Rule not found");
//   }

//   data.splice(ruleIndex, 1);

//   res.status(200).json(new ApiResponse(200, {}, "Rule deleted successfully"));
// });

// export const saveRuleById = asyncHandler(async (req, res) => {
//   const { id, rule } = req.body;

//   if (!id || !rule.flowData || !rule.flowInputField) {
//     throw new ApiError(400, "Please provide valid ID, flowData, and flowInputField");
//   }

//   const existingRule = data.find(r => r.id === id);
//   if (!existingRule) {
//     throw new ApiError(404, "Rule not found");
//   }

//   existingRule.data = rule.flowData;
//   existingRule.flowInput = rule.flowInputField;

//   res.status(200).json(new ApiResponse(200, existingRule, "Rule updated successfully"));
// });

// export const getRuleById = asyncHandler(async (req, res) => {
//   const { id } = req.params;

//   const rule = data.find(r => r.id === id);
//   if (!rule) {
//     throw new ApiError(404, "Rule not found");
//   }

//   res.status(200).json(new ApiResponse(200, rule, "Rule retrieved successfully"));
// });


export const getAllRuleByOrgId = asyncHandler(async (req, res) => {
  const orgId = req.params.orgId;
  console.log("Getting rules for orgId: ", orgId);
  if (!orgId) {
    throw new ApiError(400, "Organization ID is required");
  }

  // Fetch rules from the database for the given organization
  const rules = await prisma.rule.findMany({
    where: {
      OrganizationId: parseInt(orgId),
    },
  });

  const categories = ["hr", "logistics", "security", "finance", "operations"];
  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] = 0;
    return acc;
  }, {});

  rules.forEach(rule => {
    if (categories.includes(rule.category)) {
      categoryCounts[rule.category]++;
    }
  });

  const totalRules = rules.length;

  res.status(200).json(new ApiResponse(200, { rules, categoryCounts, totalRules }, "Rules fetched successfully"));
});

export const createRuleByOrgId = asyncHandler(async (req, res) => {
  const orgId = req.params.orgId;
  const rule = req.body;

  // Check if the OrganizationId exists
  const organization = await prisma.organization.findUnique({
    where: {
      id: parseInt(orgId),
    },
  });

  if (!organization) {
    throw new ApiError(400, "Organization not found");
  }

  if (!rule.name || !rule.description || !rule.data || !rule.category || !rule.ruleType) {
    throw new ApiError(400, "Please provide all required fields");
  }

  const validCategories = ["hr", "logistics", "security", "finance", "operations"];
  const validRuleTypes = ["SHORT_RULE", "LONG_RULE"];

  if (!validCategories.includes(rule.category)) {
    throw new ApiError(400, "Invalid category provided");
  }

  if (!validRuleTypes.includes(rule.ruleType)) {
    throw new ApiError(400, "Invalid ruleType provided");
  }

  // Check if rule already exists for this organization
  const existingRule = await prisma.rule.findFirst({
    where: {
      name: rule.name,
      OrganizationId: parseInt(orgId)
    }
  });

  if (existingRule) {
    throw new ApiError(400, "Rule with this name already exists for this organization");
  }

  // Create the new rule in the database
  const newRule = await prisma.rule.create({
    data: {
      name: rule.name,
      description: rule.description,
      data: rule.data,
      flowInput: rule.flowInput || null,
      secret: Math.random().toString(36).substring(2, 15),
      status: "ACTIVE",
      ruleType: rule.ruleType,
      activationDate: new Date(),
      category: rule.category,
      versions: rule.versions || "1.0",
      OrganizationId: parseInt(orgId)
    }
  });

  res.status(201).json(new ApiResponse(201, newRule, "Rule created successfully"));
});

export const editRuleById = asyncHandler(async (req, res) => {
  const { orgId, id } = req.params;
  const updatedRuleData = req.body;

  // Fetch the existing rule from the database
  const existingRule = await prisma.rule.findFirst({
    where: {
      id: parseInt(id),
      OrganizationId: parseInt(orgId)
    }
  });

  if (!existingRule) {
    throw new ApiError(404, "Rule not found");
  }

  const validCategories = ["hr", "logistics", "security", "finance", "operations"];
  const validRuleTypes = ["SHORT_RULE", "LONG_RULE"];
  const validStatuses = ["ACTIVE", "INACTIVE"];

  if (updatedRuleData.category && !validCategories.includes(updatedRuleData.category)) {
    throw new ApiError(400, "Invalid category provided");
  }

  if (updatedRuleData.ruleType && !validRuleTypes.includes(updatedRuleData.ruleType)) {
    throw new ApiError(400, "Invalid ruleType provided");
  }

  if (updatedRuleData.status && !validStatuses.includes(updatedRuleData.status)) {
    throw new ApiError(400, "Invalid status provided");
  }

  // Update the rule in the database
  const updatedRule = await prisma.rule.update({
    where: {
      id: parseInt(id)
    },
    data: {
      ...updatedRuleData,
      updatedAt: new Date()
    }
  });

  res.status(200).json(new ApiResponse(200, updatedRule, "Rule updated successfully"));
});

export const deleteRuleById = asyncHandler(async (req, res) => {
  const { orgId, id } = req.params;

  // Fetch the existing rule from the database
  const existingRule = await prisma.rule.findFirst({
    where: {
      id: parseInt(id),
      OrganizationId: parseInt(orgId)
    }
  });

  if (!existingRule) {
    throw new ApiError(404, "Rule not found");
  }

  // Delete the rule from the database
  await prisma.rule.delete({
    where: {
      id: parseInt(id)
    }
  });

  res.status(200).json(new ApiResponse(200, {}, "Rule deleted successfully"));
});

export const saveRuleById = asyncHandler(async (req, res) => {
  const { id, rule } = req.body;

  if (!id || !rule.flowData || !rule.flowInputField) {
    throw new ApiError(400, "Please provide valid ID, flowData, and flowInputField");
  }

  // Fetch the existing rule from the database
  const existingRule = await prisma.rule.findFirst({
    where: {
      id: parseInt(id)
    }
  });

  if (!existingRule) {
    throw new ApiError(404, "Rule not found");
  }

  // Update rule's flow data and flow input
  const updatedRule = await prisma.rule.update({
    where: {
      id: parseInt(id)
    },
    data: {
      data: rule.flowData,
      flowInput: rule.flowInputField
    }
  });

  res.status(200).json(new ApiResponse(200, updatedRule, "Rule updated successfully"));
});

export const getRuleById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Fetch the rule by ID from the database
  const rule = await prisma.rule.findUnique({
    where: {
      id: parseInt(id)
    }
  });

  if (!rule) {
    throw new ApiError(404, "Rule not found");
  }

  res.status(200).json(new ApiResponse(200, rule, "Rule retrieved successfully"));
});
