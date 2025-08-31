/**
 * @fileoverview Authentication Context for managing user authentication state
 * 
 * This file provides a React context for managing user authentication including:
 * - User login/logout functionality
 * - Token management
 * - User profile updates
 * - Persistent authentication state
 * 
 * Uses constate for optimized context creation and storage utilities for persistence.
 */

import React, { useState, useEffect } from 'react';
import constate from 'constate';
import * as authService from '../service/authService';
import * as storage from '../utils/storage';
import { User, Tokens } from '../types';
import { LoginCredentials, RegisterData } from '../utils/validation';
import { setAuthToken, clearAuthToken } from '../service/api';

/**
 * Custom hook for managing authentication state and operations
 * 
 * @returns {Object} Authentication context with user state and methods
 * @returns {User|null} returns.user - Current authenticated user or null
 * @returns {Tokens|null} returns.tokens - Current JWT tokens or null
 * @returns {boolean} returns.isLoading - Loading state for authentication operations
 * @returns {Function} returns.login - Function to authenticate user with credentials
 * @returns {Function} returns.register - Function to register new user
 * @returns {Function} returns.logout - Function to logout current user
 * @returns {Function} returns.updateProfile - Function to update user profile
 */
function useAuthHook() {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /**
     * Loads user authentication data from persistent storage on component mount
     * Attempts to restore session and fetch current user profile
     */
    const loadUserFromStorage = async () => {
      setIsLoading(true);
      const storedTokens = await storage.getTokens();
      if (storedTokens) {
        setTokens(storedTokens);
        setAuthToken(storedTokens.access);
        try {
          const userData = await authService.getUserProfile();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user on load:', error);
          await logout();
        }
      }
      setIsLoading(false);
    };
    loadUserFromStorage();
  }, []);

  /**
   * Authenticates a user with provided credentials
   * 
   * @param {LoginCredentials} credentials - User login credentials
   * @returns {Promise<void>} Resolves when login is successful
   */
  const login = async (credentials: LoginCredentials) => {
    const { user, tokens } = await authService.login(credentials);
    setUser(user);
    setTokens(tokens);
    setAuthToken(tokens.access);
    await storage.setTokens(tokens);
  };

  /**
   * Registers a new user account
   * 
   * @param {RegisterData} data - User registration data
   * @returns {Promise<void>} Resolves when registration is successful
   */
  const register = async (data: RegisterData) => {
    const { user, tokens } = await authService.register(data);
    setUser(user);
    setTokens(tokens);
    setAuthToken(tokens.access);
    await storage.setTokens(tokens);
  };

  /**
   * Logs out the current user and clears all authentication data
   * Attempts server-side logout but continues with client cleanup regardless
   * 
   * @returns {Promise<void>} Resolves when logout is complete
   */
  const logout = async () => {
    if (tokens?.refresh) {
      try {
        await authService.logout({ refresh_token: tokens.refresh });
      } catch (error) {
        console.error("Logout failed on server, clearing client-side anyway:", error);
      }
    }
    setUser(null);
    setTokens(null);
    clearAuthToken();
    await storage.clearTokens();
  };

  /**
   * Updates the current user's profile information
   * 
   * @param {FormData} data - Form data containing profile updates
   * @returns {Promise<void>} Resolves when profile update is successful
   * @throws {Error} When profile update fails
   */
  const updateProfile = async (data: FormData) => {
    try {
      const updatedUser = await authService.updateUserProfile(data);
      setUser(updatedUser);
    } catch (error) {
      console.error("Context: Update Profile Failed", error);
      throw error;
    }
  };

  return { user, tokens, isLoading, login, register, logout,updateProfile };
}

/**
 * Authentication context provider and hook
 * 
 * Provides authentication state and methods to the component tree
 * Uses constate for optimized context creation
 */
export const [AuthProvider, useAuth] = constate(useAuthHook);