import React, { useState, useEffect } from 'react';
import constate from 'constate';
import * as authService from '../service/authService';
import * as storage from '../utils/storage';
import { User, Tokens } from '../types';
import { LoginCredentials, RegisterData } from '../utils/validation';
import { setAuthToken, clearAuthToken } from '../service/api';

function useAuthHook() {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

  const login = async (credentials: LoginCredentials) => {
    const { user, tokens } = await authService.login(credentials);
    setUser(user);
    setTokens(tokens);
    setAuthToken(tokens.access);
    await storage.setTokens(tokens);
  };

  const register = async (data: RegisterData) => {
    const { user, tokens } = await authService.register(data);
    setUser(user);
    setTokens(tokens);
    setAuthToken(tokens.access);
    await storage.setTokens(tokens);
  };

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

export const [AuthProvider, useAuth] = constate(useAuthHook);