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
import vm from 'vm';
const prisma = new PrismaClient();
import fs from "fs";
import path from 'path';

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
  const orgId = parseInt(req.params.orgId);
  const rule = req.body;

  console.log("check the rule.data", rule);

  // Check if the Organization exists
  const organization = await prisma.organization.findUnique({
    where: { id: orgId },
  });

  if (!organization) {
    throw new ApiError(400, "Organization not found");
  }

  // Validate required fields
  if (!rule.name || !rule.description || !rule.data || !rule.category || !rule.ruleType) {
    throw new ApiError(400, "Please provide all required fields");
  }

  // Valid categories and rule types
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
      OrganizationId: orgId,
    },
  });

  if (existingRule) {
    throw new ApiError(400, "Rule with this name already exists for this organization");
  }

  // Create the new rule
  const newRule = await prisma.rule.create({
    data: {
      name: rule.name,
      description: rule.description,
      data: rule.data,
      flowInput: rule.flowInputField || null,
      secret: Math.random().toString(36).substring(2, 15),
      status: "ACTIVE",
      ruleType: rule.ruleType,
      activationDate: new Date(),
      category: rule.category,
      OrganizationId: orgId,
    },
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

  // Fetch the existing rule from the database, including its versions
  const existingRule = await prisma.rule.findFirst({
    where: {
      id: parseInt(id),
      OrganizationId: parseInt(orgId),
    },
    include: {
      versions: true, // Include the versions
    },
  });

  if (!existingRule) {
    throw new ApiError(404, "Rule not found");
  }

  // Delete all versions associated with the rule
  if (existingRule.versions && existingRule.versions.length > 0) {
    await prisma.version.deleteMany({
      where: {
        ruleId: parseInt(id), // Delete versions associated with this rule
      },
    });
  }

  // Delete the rule after its versions have been removed
  await prisma.rule.delete({
    where: {
      id: parseInt(id),
    },
  });

  res.status(200).json(new ApiResponse(200, {}, "Rule and associated versions deleted successfully"));
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

//Version

export const createVersionByRuleId = asyncHandler(async (req, res) => {
  const ruleId = parseInt(req.params.ruleId);
  console.log("-->", ruleId);
  const { versionName, updatedRule } = req.body;

  // Validate rule existence
  const existingRule = await prisma.rule.findUnique({
    where: { id: ruleId },
  });

  if (!existingRule) {
    throw new ApiError(400, "Rule not found");
  }

  // Validate request body
  if (!versionName || !updatedRule) {
    throw new ApiError(400, "Please provide both version name and data");
  }

  // Check if version already exists for this rule
  const existingVersion = await prisma.version.findFirst({
    where: {
      ruleId: ruleId,
      versionName: versionName,
    },
  });

  if (existingVersion) {
    throw new ApiError(400, "Version with this name already exists for this rule");
  }

  if (!updatedRule.flowData) {
    throw new ApiError(400, "Please provide all required fields");
  }

  await prisma.rule.update({
    where: {
      id: ruleId
    },
    data: {
      data: updatedRule.flowData,
      flowInput: updatedRule.flowInput || null
    }
  });

  // Create new version
  const newVersion = await prisma.version.create({
    data: {
      versionName: versionName,
      data: updatedRule.flowData,
      flowInput: updatedRule.flowInputField || null,
      rule: { connect: { id: ruleId } },
    },
  });

  res.status(201).json(new ApiResponse(201, newVersion, "Version created successfully"));
});


export const updateVersionByVersionId = asyncHandler(async (req, res) => {
  const versionId = parseInt(req.params.versionId);
  const { updatedRule } = req.body;

  // Find the existing version
  const existingVersion = await prisma.version.findUnique({
    where: { id: versionId },
    include: { rule: true }, // Include related rule data
  });

  if (!existingVersion) {
    throw new ApiError(404, "Version not found");
  }

  console.log("existingVersion : ", existingVersion.data);

  // Find the latest version for the rule
  const latestVersion = await prisma.version.findFirst({
    where: { ruleId: existingVersion.ruleId },
    orderBy: { createdAt: 'desc' }, // Get the latest version by createdAt
  });

  // Update the version
  const updatedVersion = await prisma.version.update({
    where: { id: versionId },
    data: {
      versionName: existingVersion.versionName,
      data: updatedRule.flowData,
      flowInput: updatedRule.flowInputField,
    },
  });

  // If the current version is the latest, update the associated rule
  if (latestVersion.id === versionId) {

    console.log("Editing the Latest version");
    await prisma.rule.update({
      where: { id: existingVersion.ruleId },
      data: {
        data: updatedRule.flowData,
        flowInput: updatedVersion.flowInputField,
      },
    });
  }

  res.status(200).json(new ApiResponse(200, updatedVersion, "Version updated successfully"));
});


export const getAllVersionByRuleId = asyncHandler(async (req, res) => {
  const ruleId = parseInt(req.params.ruleId);

  // Validate rule existence
  const existingRule = await prisma.rule.findUnique({
    where: { id: ruleId },
  });

  if (!existingRule) {
    throw new ApiError(404, "Rule not found");
  }

  // Fetch all versions for the rule
  const versions = await prisma.version.findMany({
    where: { ruleId: ruleId },
  });

  res.status(200).json(new ApiResponse(200, versions, "Versions retrieved successfully"));
});

export const deleteVersionById = asyncHandler(async (req, res) => {
  const versionId = parseInt(req.params.id);

  // Validate input
  if (isNaN(versionId)) {
    throw new ApiError(400, "Invalid version ID");
  }

  // Find the version to ensure it exists
  const existingVersion = await prisma.version.findUnique({
    where: { id: versionId },
  });

  if (!existingVersion) {
    throw new ApiError(404, "Version not found");
  }

  // Delete the version
  await prisma.version.delete({
    where: { id: versionId },
  });

  res.status(200).json(new ApiResponse(200, null, "Version deleted successfully"));
});

export const createNodesAndEdges = async (req, res) => {
  const { ruleId, nodes, edges } = req.body;

  if (!ruleId || !nodes || !edges) {
    return res.status(400).json({ message: "ruleId, nodes, and edges are required" });
  }

  try {
    // First, check if the rule exists
    const rule = await prisma.rule.findUnique({
      where: { id: ruleId }
    });

    if (!rule) {
      return res.status(404).json({ message: "Rule not found" });
    }
    // Process nodes
    const nodePromises = nodes.map((nodeData) => {
      const { id, data, type, measured, position } = nodeData;
      return prisma.node.upsert({
        where: { id },
        update: {
          type,
          positionX: position.x,
          positionY: position.y,
          width: measured.width,
          height: measured.height,
          data,
        },
        create: {
          id,
          type,
          positionX: position.x,
          positionY: position.y,
          width: measured.width,
          height: measured.height,
          data,
          ruleId,
        },
      });
    });

    const nodesResult = await Promise.all(nodePromises);

    // Update or create edges for this rule
    const edgePromises = edges.map((edgeData) =>
      prisma.edge.upsert({
        where: { id: edgeData.id },
        update: {
          source: edgeData.source,
          target: edgeData.target,
          animated: true,
          label: edgeData.label,
        },
        create: {
          ...edgeData,
          ruleId: rule.id,
          animated: true,
        },
      })
    );

    const edgesResult = await Promise.all(edgePromises);

    return res.status(201).json({
      message: 'Nodes and edges created/updated successfully',
      nodes: nodesResult,
      edges: edgesResult,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', err: error });
  }
};


// GET route to fetch nodes and edges by ruleId
export const fetchNodesAndEdges = async (req, res) => {
  const { ruleId } = req.params;

  if (!ruleId) {
    return res.status(400).json({ message: "ruleId is required" });
  }

  try {
    // Fetch the rule to ensure it exists
    const rule = await prisma.rule.findUnique({
      where: { id: parseInt(ruleId) },
      include: {
        nodes: true,
        edges: true
      }
    });

    if (!rule) {
      return res.status(404).json({ message: "Rule not found" });
    }

    // Return the nodes and edges associated with the rule
    const nodesAndEdges = {
      nodes: rule.nodes,
      edges: rule.edges
    };

    return res.status(200).json(nodesAndEdges);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const getNodesAndEdgesByRule = async (req, res) => {
  const { ruleId } = req.params;

  if (!ruleId) {
    return res.status(400).json({ message: "ruleId is required" });
  }

  try {
    // Fetch the rule with associated nodes and edges
    const rule = await prisma.rule.findUnique({
      where: { id: parseInt(ruleId, 10) },
      include: {
        nodes: true, // Include associated nodes
        edges: true, // Include associated edges
      },
    });

    if (!rule) {
      return res.status(404).json({ message: "Rule not found" });
    }

    // Return the nodes and edges
    return res.status(200).json({
      message: "Nodes and edges fetched successfully",
      nodes: rule.nodes,
      edges: rule.edges,
    });
  } catch (error) {
    console.error("Error fetching nodes and edges:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// Save or update flow file
export const saveFlowFile = async (req, res) => {
  const { ruleId } = req.params;
  const { name, content } = req.body;

  if (!ruleId || !name || !content) {
    return res.status(400).json({ error: "Rule ID, name, and content are required" });
  }

  console.log("Contents: ", content);
  try {
    // Upsert the flow file
    const flowFile = await prisma.flowFile.upsert({
      where: { ruleId },
      update: {
        name,
        content,
      },
      create: {
        ruleId,
        name,
        content,
      },
    });

    res.status(200).json({ message: "Flow file saved or updated successfully", flowFile });
  } catch (error) {
    console.error("Error saving flow file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get flow files by ruleId
export const getFlowFile = async (req, res) => {
  const { ruleId } = req.params;

  if (!ruleId) {
    return res.status(400).json({ error: "Rule ID is required" });
  }

  try {
    const flowFile = await prisma.flowFile.findUnique({
      where: { ruleId },
    });

    if (!flowFile) {
      return res.status(404).json({ error: "Flow file not found" });
    }

    res.status(200).json(flowFile);
  } catch (error) {
    console.error("Error fetching flow file:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// Exposing Endpoint 
export const copyEndpoint = async (req, res) => {

  const { id } = req.params;
  const { ...choices } = req.body;  // Spread to allow dynamic keys for choices

  console.log("Inside CopyEndpoint: ", id);
  if (Object.keys(choices).length === 0) {
    return res.status(400).json({ error: 'At least one choice is required.' });
  }

  try {
    const rule = await prisma.flowFile.findUnique({ where: { ruleId: id } });

    // Function to extract the flow JSON from the JavaScript content
    const extractFlowJSON = (content) => {
      try {
        const cleanedContent = content.trim();
        const match = cleanedContent.match(/export const flow = ({.*?});/s);

        if (match && match[1]) {
          const jsonString = match[1];
          return JSON.parse(jsonString); // Return parsed JSON object
        } else {
          throw new Error("Flow JSON object not found.");
        }
      } catch (err) {
        console.error("Error parsing flow content:", err);
        return null;
      }
    };

    const jsContent = extractFlowJSON(rule.content);
    console.log("Rule is: ", rule.content);
    console.log("js Content is: ", jsContent);

    if (!rule) return res.status(404).json({ error: 'Rule Not Found' });

    // Helper function to navigate through the flow based on the choices
    const navigateFlow = (node, choices) => {
      let currentNode = node;

      // Iterate over all the choices provided in req.body
      for (const [key, value] of Object.entries(choices)) {
        const option = currentNode.options.find(opt => opt.label === value);
        if (!option) {
          throw new Error(`Option "${value}" not found in node: ${currentNode.question}`);
        }
        currentNode = option.next; // Move to the next node
      }

      return currentNode;
    };

    // Start from the first node and navigate based on the choices
    let currentNode = jsContent;
    try {
      currentNode = navigateFlow(currentNode, choices); // Use the provided choices to navigate the flow
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    // If the node type is OUTPUT_NODE, return the final output
    if (currentNode.type === "OUTPUT_NODE") {
      return res.status(200).json({ output: currentNode.question });
    }

    // If no output node is reached
    return res.status(400).json({ error: 'No output node reached.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error processing the rule' });
  }

};


export const executeCode = (req, res) => {
  const { code, input } = req.body;

  console.log("Req. body is: ", req.body);

  if (!code || typeof code !== "string") {
    return res.status(400).json({ message: "Invalid or missing code." });
  }

  try {
    // Create a sandbox environment to isolate the code execution
    const sandbox = {
      userInput: input,
      output: null,
      console: {
        log: (...args) => {
          sandbox.output = args.join(' ');  // Capture console.log output
        }
      }
    };

    // Create a script for running the user-provided code
    const script = new vm.Script(`
         ${code} 
    `);

    // Define options for the sandbox and script execution
    const options = {
      timeout: 5000, // Timeout after 5 seconds
      memoryLimit: 50 * 1024 * 1024, // Limit memory usage to 50MB
    };

    // Set up a context for the execution with strict sandboxing
    const context = new vm.createContext(sandbox);

    // Run the script in the sandboxed context with timeout handling
    const timeout = setTimeout(() => {
      throw new Error('Execution timed out');
    }, options.timeout);

    script.runInContext(context);

    clearTimeout(timeout);  // Clear timeout after successful execution

    // Return the output of the executed code
    return res.status(200).json({ output: sandbox.output });
  } catch (error) {
    console.error("Code execution error:", error.message);
    return res.status(500).json({ message: "Error executing code.", details: error.message });
  }
};


export const createUpdateSecretKeys = async (req, res) => {
  const { userId, key, value } = req.body;

  if (!userId || !key || !value) {
    return res.status(400).json({ error: "User ID, key, and value are required" });
  }

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if a secret key with the same key exists for this user
    const existingSecretKey = await prisma.secretKey.findFirst({
      where: { userId, key },
    });

    if (existingSecretKey) {
      // Update the existing secret key
      const updatedSecretKey = await prisma.secretKey.update({
        where: { id: existingSecretKey.id },
        data: { value },
      });

      return res.status(200).json({ message: "Secret key updated successfully", updatedSecretKey });
    }

    // Create a new secret key for the user
    const newSecretKey = await prisma.secretKey.create({
      data: { userId, key, value },
    });

    return res.status(201).json({ message: "Secret key created successfully", newSecretKey });
  } catch (error) {
    console.error("Error storing secret key:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Route to fetch secret keys for a user
export const getSecretKeysWithUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const secretKeys = await prisma.secretKey.findMany({
      where: { userId: parseInt(userId) },
    });

    if (secretKeys.length === 0) {
      return res.status(404).json({ error: "No secret keys found for this user" });
    }

    return res.status(200).json({ secretKeys });
  } catch (error) {
    console.error("Error fetching secret keys:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateSecretKeys = async (req, res) => {
  const { id } = req.params;
  const { key, value } = req.body;

  if (!key || !value) {
    return res.status(400).json({ error: "Key and value are required" });
  }

  try {
    // Check if the secret key exists
    const secretKey = await prisma.secretKey.findUnique({
      where: { id: parseInt(id) },
    });

    if (!secretKey) {
      return res.status(404).json({ error: "Secret key not found" });
    }

    // Update the secret key
    const updatedSecretKey = await prisma.secretKey.update({
      where: { id: parseInt(id) },
      data: { key, value },
    });

    return res.status(200).json({ message: "Secret key updated successfully", updatedSecretKey });
  } catch (error) {
    console.error("Error updating secret key:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteSecretKeys = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the secret key exists
    const secretKey = await prisma.secretKey.findUnique({
      where: { id: parseInt(id) },
    });

    if (!secretKey) {
      return res.status(404).json({ error: "Secret key not found" });
    }

    // Delete the secret key
    await prisma.secretKey.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ message: "Secret key deleted successfully" });
  } catch (error) {
    console.error("Error deleting secret key:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


// DATASET CONTROLLERS

// Upload a new dataset
export const uploadDataset = async (req, res) => {
  const { title } = req.body;
  const file = req.file;

  if (!title || (!file && !req.body.fileUrl)) {
    return res.status(400).json({ error: "Title and file or file URL are required" });
  }

  try {
    // Check for duplicate title
    const existingDataset = await prisma.dataset.findUnique({ where: { title } });
    if (existingDataset) {
      return res.status(400).json({ error: "Dataset with this title already exists." });
    }

    const fileUrl = file ? path.join("uploads", file.filename) : req.body.fileUrl;

    // Save dataset in the database
    const dataset = await prisma.dataset.create({
      data: { title, fileUrl },
    });

    return res.status(201).json({ message: "Dataset uploaded successfully", dataset });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to upload dataset" });
  }
};

// Get all datasets
export const getDatasets = async (req, res) => {
  try {
    const datasets = await prisma.dataset.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(datasets);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch datasets" });
  }
};

// Delete a dataset
export const deleteDataset = async (req, res) => {
  const { id } = req.params;

  try {
    const dataset = await prisma.dataset.findUnique({ where: { id: parseInt(id) } });

    if (!dataset) {
      return res.status(404).json({ error: "Dataset not found" });
    }

    // Delete the dataset file from the server (if applicable)
    if (fs.existsSync(dataset.fileUrl)) {
      fs.unlinkSync(dataset.fileUrl);
    }

    // Delete from the database
    await prisma.dataset.delete({ where: { id: parseInt(id) } });

    return res.status(200).json({ message: "Dataset deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete dataset" });
  }
};

// Update or re-upload a dataset
export const updateDataset = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const file = req.file;

  try {
    const dataset = await prisma.dataset.findUnique({ where: { id: parseInt(id) } });

    if (!dataset) {
      return res.status(404).json({ error: "Dataset not found" });
    }

    const updatedData = { title };

    if (file) {
      // Delete the old file if it exists
      if (fs.existsSync(dataset.fileUrl)) {
        fs.unlinkSync(dataset.fileUrl);
      }

      // Update the file URL
      updatedData.fileUrl = path.join("uploads", file.filename);
    }

    const updatedDataset = await prisma.dataset.update({
      where: { id: parseInt(id) },
      data: updatedData,
    });

    return res.status(200).json({ message: "Dataset updated successfully", updatedDataset });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update dataset" });
  }
};

// Retrieve a dataset by title
export const getDatasetByTitle = async (req, res) => {
  const { title } = req.params;

  try {
    const dataset = await prisma.dataset.findUnique({
      where: {
        title,
      },
    });

    if (!dataset) {
      return res.status(404).json({ error: "Dataset not found" });
    }

    res.status(200).json(dataset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve dataset" });
  }
};
