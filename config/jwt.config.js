/**
 * File: jwt.config.js
 * Description:
 *
 * Developed by: Arshdeep Singh
 * Developed on: 27-11-2024
 *
 * Updated by: [Name] 
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

export const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';
export const JWT_ACCESS_EXPIRATION = '24h'; 
export const JWT_REFRESH_EXPIRATION = '7d'; 
