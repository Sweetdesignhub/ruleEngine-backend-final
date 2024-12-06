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
  deleteVersionById
} from "../controllers/rule.controller.js";

import {
  getTableData,
  getDatabaseDetails,
  insertTableData,
  joinTableData
} from "../controllers/database.controller.js";


const router = Router();


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
router.post('/database/table/insert', insertTableData);
router.post('/database/join/dbdata', joinTableData);

export default router;
