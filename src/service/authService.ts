import { api } from './api';
import { User, Tokens } from '../types';
import { LoginCredentials, RegisterData } from '../utils/validation';

export const register = async (data: RegisterData): Promise<{ user: User; tokens: Tokens }> => {
  const response = await api.post('/auth/register/', data);
  return response.data;
};

export const login = async (credentials: LoginCredentials): Promise<{ user: User; tokens: Tokens }> => {
  const response = await api.post('/auth/login/', credentials);
  const { refresh, access, user } = response.data;
  return { user, tokens: { refresh, access } };
};

export const logout = async (data: { refresh_token: string }): Promise<void> => {
  await api.post('/auth/logout/', data);
};

export const getUserProfile = async (): Promise<User> => {
  const response = await api.get('/auth/user/');
  return response.data;
};

export const updateUserProfile = async (data: FormData): Promise<User> => {
  const response = await api.patch('/auth/profile/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
