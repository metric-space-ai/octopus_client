import {IUser} from '@/types';
import {IAuthData, ICompanyRegisterPayload, IRegisterPayload} from '@/types/auth';

import apiHub from '../hooks/useApiClient';

export const login = async (email: string, password: string) => {
  const payload = {email, password};
  return apiHub.post<IAuthData>('/api/v1/auth', payload);
};

export const register = async (payload: IRegisterPayload) => {
  return apiHub.post('/api/v1/auth/register', payload);
};

export const forgotPassword = async (email: string) => {
  const payload = {email};
  return apiHub.post('/api/v1/password-resets', payload);
};

export const resetPassword = async (token: string, password: string) => {
  const payload = {password, repeat_password: password};
  return apiHub.put(`/api/v1/password-resets/${token}`, payload);
};

export const checkSetupApi = async () => {
  return apiHub.get('/api/v1/setup');
};

export const setupApi = async (payload: ICompanyRegisterPayload) => {
  return apiHub.post('/api/v1/setup', payload);
};

export const getProfile = async (id: string) => {
  return apiHub.get<IUser>(`/api/v1/profiles/${id}`);
};
