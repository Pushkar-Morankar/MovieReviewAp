/**
 * @fileoverview Secure token storage utilities for authentication
 * 
 * This file provides functions for managing JWT tokens in persistent storage:
 * - Storing authentication tokens securely
 * - Retrieving stored tokens
 * - Clearing tokens during logout
 * 
 * Uses AsyncStorage for cross-platform persistent storage with proper
 * error handling and JSON serialization/deserialization.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tokens } from '../types';

/** Storage key for user authentication tokens */
const TOKEN_KEY = 'user_tokens';

/**
 * Stores the user's JWT tokens securely.
 * @param {Tokens} tokens - The access and refresh tokens.
 */
export const setTokens = async (tokens: Tokens): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  } catch (error) {
    console.error('Error setting tokens in storage', error);
  }
};

/**
 * Retrieves the user's JWT tokens from storage.
 * @returns {Promise<Tokens | null>} The stored tokens or null if not found.
 */
export const getTokens = async (): Promise<Tokens | null> => {
  try {
    const tokenString = await AsyncStorage.getItem(TOKEN_KEY);
    return tokenString ? JSON.parse(tokenString) : null;
  } catch (error) {
    console.error('Error getting tokens from storage', error);
    return null;
  }
};

/**
 * Clears the user's JWT tokens from storage.
 */
export const clearTokens = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error clearing tokens from storage', error);
  }
};