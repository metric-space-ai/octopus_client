import {IUser, IUserProfile} from '@/types';
import {
  IAuthData,
  ICompanyRegisterPayload,
  IRegisterPayload,
  IUpdateUserPayload,
  IUpdateUserProfilePayload,
} from '@/types/auth';

import apiHub from '../hooks/useApiClient';
import {IDeviceMap, IPlugin, IResources} from '@/types/plugin';

export const login = async (email: string, password: string) => {
  const payload = {email, password};
  return apiHub.post<IAuthData>('api/v1/auth', payload);
};

export const register = async (payload: IRegisterPayload) => {
  return apiHub.post('api/v1/auth/register', payload);
};

export const changePassword = async (userId: string, old_password: string, password: string) => {
  const payload = {old_password, password, repeat_password: password};
  return apiHub.put(`api/v1/auth/${userId}`, payload);
};

export const forgotPassword = async (email: string) => {
  const payload = {email};
  return apiHub.post('api/v1/password-resets', payload);
};

export const resetPassword = async (token: string, password: string) => {
  const payload = {password, repeat_password: password};
  return apiHub.put(`api/v1/password-resets/${token}`, payload);
};

export const checkSetupApi = async () => {
  return apiHub.get('api/v1/setup');
};

export const setupApi = async (payload: ICompanyRegisterPayload) => {
  return apiHub.post('api/v1/setup', payload);
};

export const getSingleUserById = async (id: string) => {
  return apiHub.get<IUser>(`api/v1/users/${id}`);
};

export const updateSingleUserById = async (id: string, payload: IUpdateUserPayload) => {
  return apiHub.put<IUser>(`api/v1/users/${id}`, payload);
};

export const getProfile = async (id: string) => {
  return apiHub.get<IUserProfile>(`api/v1/profiles/${id}`);
};

export const updateUserProfile = async (id: string, payload: IUpdateUserProfilePayload) => {
  return apiHub.put<IUserProfile>(`api/v1/profiles/${id}`, payload);
};

export const updateUserProfilePic = async (id: string, payload: FormData) => {
  apiHub.defaults.headers;
  // const headers = {...apiHub.defaults.headers, 'Content-Type': 'multipart/form-data'};
  // apiHub.defaults.headers = headers;
  return apiHub.put<IUserProfile>(`api/v1/profile-pictures/${id}`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deletePluginByIdApi = async (plugin_id: string) => {
  return apiHub.delete<null>(`api/v1/ai-services/${plugin_id}`);
};

export const getAllPluginsApi = async () => {
  return apiHub.get<IPlugin[]>(`api/v1/ai-services`);
};

export const getPluginByIdApi = async (plugin_id: string) => {
  return apiHub.get<IPlugin>(`api/v1/ai-services/${plugin_id}`);
};

export const getServerResourcesApi = async () => {
  return apiHub.get<IResources>(`api/v1/server-resources`);
};

export const startPluginInstallationApi = async (plugin_id: string) => {
  return await apiHub.put<IPlugin>(`api/v1/ai-services/${plugin_id}/installation`);
};

export const addPluginConfigurationApi = async (plugin_id: string, payload: IDeviceMap) => {
  console.log(payload)
  return await apiHub.put<IPlugin>(`api/v1/ai-services/${plugin_id}/configuration`, {device_map: payload});
};

export const uploadNewPluginApi = async (payload: FormData) => {
  return apiHub.post<IPlugin>(`api/v1/ai-services`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
