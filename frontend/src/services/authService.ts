import api from './api';
import type { AuthResponse, User } from '../types/auth';

export const login = async (data: any): Promise<AuthResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', data.email);
  formData.append('password', data.password);
  
  const response = await api.post('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return response.data;
};

export const register = async (data: any): Promise<User> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const googleAuth = async (credential: string, role?: string): Promise<AuthResponse> => {
  const response = await api.post('/auth/google', { credential, role: role || 'buyer' });
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get('/auth/me');
  return response.data;
};
