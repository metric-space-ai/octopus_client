import {IAuthResponse, IRegisterPayload} from '@/types/auth';

import apiHub from '../hooks/useApiClient';

export const login = async (email: string, password: string) => {
  const payload = {email, password};
  return apiHub.post<IAuthResponse>('/api/v1/auth', payload);
};

export const register = async (payload: IRegisterPayload) => {
  return apiHub.post<IAuthResponse>('/api/v1/auth/register', payload);
};
