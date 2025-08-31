/**
 * @fileoverview Authentication service for user management operations
 * 
 * This file provides API functions for user authentication and profile management:
 * - User registration and login
 * - User logout
 * - Profile retrieval and updates
 * 
 * All functions use the configured API client with proper error handling
 * and return typed responses for type safety.
 */

import { api } from './api';
import { User, Tokens } from '../types';
import { LoginCredentials, RegisterData } from '../utils/validation';

/**
 * Registers a new user account
 * 
 * @param {RegisterData} data - User registration information
 * @returns {Promise<{user: User, tokens: Tokens}>} User data and authentication tokens
 * @throws {Error} When registration fails
 */
export const register = async (data: RegisterData): Promise<{ user: User; tokens: Tokens }> => {
  const response = await api.post('/auth/register/', data);
  return response.data;
};

/**
 * Authenticates a user with provided credentials
 * 
 * @param {LoginCredentials} credentials - User login credentials
 * @returns {Promise<{user: User, tokens: Tokens}>} User data and authentication tokens
 * @throws {Error} When authentication fails
 */
export const login = async (credentials: LoginCredentials): Promise<{ user: User; tokens: Tokens }> => {
  const response = await api.post('/auth/login/', credentials);
  const { refresh, access, user } = response.data;
  return { user, tokens: { refresh, access } };
};

/**
 * Logs out a user by invalidating their refresh token
 * 
 * @param {Object} data - Logout data containing refresh token
 * @param {string} data.refresh_token - The refresh token to invalidate
 * @returns {Promise<void>} Resolves when logout is successful
 * @throws {Error} When logout fails
 */
export const logout = async (data: { refresh_token: string }): Promise<void> => {
  await api.post('/auth/logout/', data);
};

/**
 * Retrieves the current authenticated user's profile information
 * 
 * @returns {Promise<User>} Current user's profile data
 * @throws {Error} When profile retrieval fails or user is not authenticated
 */
export const getUserProfile = async (): Promise<User> => {
  const response = await api.get('/auth/user/');
  return response.data;
};

/**
 * Updates the current user's profile information
 * 
 * @param {FormData} data - Form data containing profile updates
 * @returns {Promise<User>} Updated user profile data
 * @throws {Error} When profile update fails
 */
export const updateUserProfile = async (data: FormData): Promise<User> => {
  const response = await api.patch('/auth/profile/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
