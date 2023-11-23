import {IUser, ICreateUser} from '@/types';

import apiHub from '../hooks/useApiClient';

// TEAM-MEMBERS
export const getAllTeamMembersApi = async () => {
  return apiHub.get<IUser[]>(`api/v1/users`);
};

export const updateTeamMemberApi = async (payload: IUser) => {
  const {email, is_enabled, roles, id} = payload;
  const data = {email, is_enabled, roles};
  return await apiHub.put<IUser>(`api/v1/users/${id}`, data);
};

export const createTeamMemberApi = async (payload: ICreateUser) => {
  return await apiHub.post<IUser>(`api/v1/users`, payload);
};

export const deleteTeamMemberApi = async (user_id: string) => {
  return apiHub.delete<IUser>(`api/v1/users/${user_id}`);
};
