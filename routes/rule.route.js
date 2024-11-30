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
  getRuleById
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

router.post('/database/get/table/data', getTableData);
router.post('/database/get/details', getDatabaseDetails);
router.post('/database/table/insert', insertTableData);
router.post('/database/join/dbdata', joinTableData);

export default router;
