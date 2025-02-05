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

import { Router } from "express";
import {
  getAllRuleByOrgId,
  createRuleByOrgId,
  editRuleById,
  deleteRuleById,
  saveRuleById,
  getRuleById,
  createVersionByRuleId,
  updateVersionByVersionId,
  getAllVersionByRuleId,
  deleteVersionById,
  createNodesAndEdges,
  fetchNodesAndEdges,
  getNodesAndEdgesByRule,
  saveFlowFile,
  getFlowFile,
  copyEndpoint,
  executeCode,
  getSecretKeysWithUserId,
  createUpdateSecretKeys,
  updateSecretKeys,
  deleteSecretKeys,
  uploadDataset,
  getDatasets,
  deleteDataset,
  updateDataset,
  getDatasetByTitle,
  getGrokResponse,
} from "../controllers/rule.controller.js";

import {
  getTableData,
  getDatabaseDetails,
  // insertTableData,
  joinTableData,
  queryData,
  updateTableData,
  deleteTableData,
  insertTableData,
  transformTableData
} from "../controllers/database.controller.js";
import multer from "multer";

const router = Router();

const upload = multer({ dest: "uploads/" });

router.get("/rule/get/:orgId", getAllRuleByOrgId);
router.post("/rule/create/:orgId", createRuleByOrgId);
router.put("/rule/edit/:orgId/:id", editRuleById);
router.delete("/rule/delete/:orgId/:id", deleteRuleById);
router.post("/rule/save", saveRuleById);
router.get("/rule/:id", getRuleById);
//Version
router.post("/rule/version/create/:ruleId", createVersionByRuleId);
router.post("/rule/version/update/:versionId", updateVersionByVersionId);
router.get("/rule/version/:ruleId", getAllVersionByRuleId);
router.delete("/rule/version/:id", deleteVersionById);

router.post('/database/get/table/data', getTableData);
router.post('/database/get/details', getDatabaseDetails);
// router.post('/database/table/insert', insertTableData);
router.post('/database/join/dbdata', joinTableData);
router.post('/database/execute-query', queryData);
router.post('/database/update/table/data', updateTableData);
router.post('/database/delete/table/data', deleteTableData);
router.post('/database/insert/table/data', insertTableData);
router.post('/database/transform/table/data', transformTableData);
router.post('/createNodesAndEdges', createNodesAndEdges);
router.get('/getNodesAndEdges/:ruleId', fetchNodesAndEdges);
router.get('/:ruleId/nodesAndEdges', getNodesAndEdgesByRule);

// POST to save the flow file
router.post("/engine-rule/:ruleId", saveFlowFile);

const SECRET_PARAM = process.env.SECRET_PARAM || "sdh_secure_secret"; // Use an environment variable for security

const validateSecretParam = (req, res, next) => {
  const providedSecret = req.query.secret; // Assuming the secret is passed as a query parameter
  if (providedSecret !== SECRET_PARAM) {
    return res.status(403).json({ message: "Forbidden: Invalid or missing secret" });
  }
  next();
};
// GET to retrieve flow files by ruleId
router.get("/engine-rule/get/:ruleId", getFlowFile);
router.post('/engine-rule/process/:id', validateSecretParam, copyEndpoint);
router.post("/decision-engine-code-js", executeCode);
router.post("/secret-key", createUpdateSecretKeys); // create/update secret key
router.get("/secret-key/:userId", getSecretKeysWithUserId); // Route to fetch secret keys for a user
router.put("/secret-key/:id", updateSecretKeys);
router.delete("/secret-key/:id", deleteSecretKeys);

// Dataset Routes
router.post("/dataset", upload.single("file"), uploadDataset); // Upload a new dataset
router.get("/dataset", getDatasets); // Get all datasets
router.delete("/dataset/:id", deleteDataset); // Delete a dataset by ID
router.put("/dataset/:id", upload.single("file"), updateDataset); // Update/re-upload a dataset
router.get("/dataset/:title", getDatasetByTitle);
router.post("/generate-response", getGrokResponse);
export default router;
