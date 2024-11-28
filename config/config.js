/**
 * File: config.js
 * Description:
 *
 * Developed by: Arshdeep Singh
 * Developed on: 27-11-2024
 *
 * Updated by: [Name] 
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query"],
});

export default prisma;