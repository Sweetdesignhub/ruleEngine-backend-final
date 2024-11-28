/**
 * File: auth.service.js
 * Description:
 *
 * Developed by: Arshdeep Singh
 * Developed on: 27-11-2024
 *
 * Updated by: [Name] 
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import bcrypt from 'bcrypt';
import { prisma } from '../db/prisma.js'; 
import { generateAccessToken, generateRefreshToken } from '../utils/token.util.js';

export const authenticateUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  if (!user.emailVerified) {
    throw new Error('Email not verified. Please verify your email before logging in.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { accessToken, refreshToken, user };
};

export const refreshAuthToken = (refreshToken) => {
  const decoded = verifyToken(refreshToken);
  const accessToken = generateAccessToken(decoded.userId);
  return { accessToken };
};
