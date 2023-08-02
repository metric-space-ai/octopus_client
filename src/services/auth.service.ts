import {IUser} from '@/types';
import {IAuthData, IRegisterPayload} from '@/types/auth';

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
  return apiHub.post('/api/v1/auth/forgot-password', payload);
};

export const getProfile = async (id: string) => {
  return apiHub.get<IUser>(`/api/v1/profiles/${id}`);
};
