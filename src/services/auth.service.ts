import {IUser, IUserProfile} from '@/types';
import {IAuthData, ICompanyRegisterPayload, IRegisterPayload, IUpdateUserPayload, IUpdateUserProfilePayload} from '@/types/auth';

import apiHub from '../hooks/useApiClient';

export const login = async (email: string, password: string) => {
  const payload = {email, password};
  return apiHub.post<IAuthData>('/api/v1/auth', payload);
};

export const register = async (payload: IRegisterPayload) => {
  return apiHub.post('/api/v1/auth/register', payload);
};

export const changePassword = async (userId: string, old_password: string, password: string) => {
  const payload = {old_password, password, repeat_password: password};
  return apiHub.put(`/api/v1/auth/${userId}`, payload);
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

export const getSingleUserById = async (id: string) => {
  return apiHub.get<IUser>(`/api/v1/users/${id}`);
};

export const updateSingleUserById = async (id: string, payload: IUpdateUserPayload) => {
  return apiHub.put<IUser>(`/api/v1/users/${id}`, payload);
};

export const getProfile = async (id: string) => {
  return apiHub.get<IUserProfile>(`/api/v1/profiles/${id}`);
};

export const updateUserProfile = async (id: string, payload: IUpdateUserProfilePayload) => {
  return apiHub.put<IUserProfile>(`/api/v1/profiles/${id}`, payload);
};

export const updateUserProfilePic = async (id: string, payload: FormData) => {
  apiHub.defaults.headers;
  // const headers = {...apiHub.defaults.headers, 'Content-Type': 'multipart/form-data'};
  // apiHub.defaults.headers = headers;
  return apiHub.put<IUserProfile>(`/api/v1/profile-pictures/${id}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
