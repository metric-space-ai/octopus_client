import {
  IUser,
  ICreateUser,
  IPlugin,
  IDeviceMap,
  IPluginActivation,
  IAIFunctions,
  IResources,
  IParameter,
  ISimpleApp,
  IWaspApp,
} from '@/types';

import apiHub from '../hooks/useApiClient';

// TEAM-MEMBERS
export const getAllTeamMembersApi = () => {
  return apiHub.get<IUser[]>(`api/v1/users`);
};

export const updateTeamMemberApi = (payload: IUser) => {
  const {email, is_enabled, roles, id} = payload;
  const data = {email, is_enabled, roles};
  return apiHub.put<IUser>(`api/v1/users/${id}`, data);
};

export const createTeamMemberApi = (payload: ICreateUser) => {
  return apiHub.post<IUser>(`api/v1/users`, payload);
};

export const deleteTeamMemberApi = (user_id: string) => {
  return apiHub.delete<IUser>(`api/v1/users/${user_id}`);
};

export const deletePluginByIdApi = (plugin_id: string) => {
  return apiHub.delete<null>(`api/v1/ai-services/${plugin_id}`);
};

export const getAllPluginsApi = () => {
  return apiHub.get<IPlugin[]>(`api/v1/ai-services`);
};

export const putAllowedUsersForAiAccessApi = (plugin_id: string, allowed_user_ids: string[]) => {
  return apiHub.put<IPlugin>(`api/v1/ai-services/${plugin_id}/allowed-users`, {allowed_user_ids});
};

export const getPluginByIdApi = (plugin_id: string) => {
  return apiHub.get<IPlugin>(`api/v1/ai-services/${plugin_id}`);
};

export const startPluginInstallationApi = (plugin_id: string) => {
  return apiHub.put<IPlugin>(`api/v1/ai-services/${plugin_id}/installation`);
};

export const addPluginConfigurationApi = (plugin_id: string, payload: IDeviceMap) => {
  return apiHub.put<IPlugin>(`api/v1/ai-services/${plugin_id}/configuration`, {device_map: payload});
};

export const uploadNewPluginApi = (payload: FormData) => {
  return apiHub.post<IPlugin>(`api/v1/ai-services`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updatePluginByIdApi = (plugin_id: string, payload: IPluginActivation) => {
  return apiHub.post<string>(`api/v1/ai-services/${plugin_id}`, payload);
};

export const getAiFunctionsByServiceIdApi = (ai_service_id: string) => {
  return apiHub.get<IAIFunctions[]>(`api/v1/ai-functions/${ai_service_id}`);
};

export const deletetAiFunctionsByIdApi = (ai_service_id: string, ai_function_id: string) => {
  return apiHub.delete<IAIFunctions[]>(`api/v1/ai-functions/${ai_service_id}/${ai_function_id}`);
};

export const updatetAiFunctionsByIdApi = (
  ai_service_id: string,
  ai_function_id: string,
  payload: {is_enabled: boolean},
) => {
  return apiHub.put<IAIFunctions[]>(`api/v1/ai-functions/${ai_service_id}/${ai_function_id}`, payload);
};

export const getServerResourcesApi = () => {
  return apiHub.get<IResources>(`api/v1/server-resources`);
};

export const getParametersApi = () => {
  return apiHub.get<IParameter[]>(`api/v1/parameters`);
};

export const getParameterByIdApi = (parameter_id: string) => {
  return apiHub.get<IParameter>(`api/v1/parameters/${parameter_id}`);
};

export const createNewParameterApi = (payload: {name: string; value: string}) => {
  return apiHub.post<IParameter>(`api/v1/parameters`, payload);
};

export const updateParameterByIdApi = (parameter_id: string, payload: {name: string; value: string}) => {
  return apiHub.put<IParameter>(`api/v1/parameters/${parameter_id}`, payload);
};

export const deleteParameterByIdApi = (parameter_id: string) => {
  return apiHub.delete<IParameter>(`api/v1/parameters/${parameter_id}`);
};

export const getParametersNameApi = () => {
  return apiHub.get<string[]>(`api/v1/parameters/names`);
};

export const getSimpleAppsApi = () => {
  return apiHub.get<ISimpleApp[]>(`api/v1/simple-apps`);
};

export const getSimpleAppByIdApi = (parameter_id: string) => {
  return apiHub.get<ISimpleApp>(`api/v1/simple-apps/${parameter_id}`);
};

export const uploadNewSimpleAppApi = (payload: FormData) => {
  return apiHub.post<ISimpleApp>(`api/v1/simple-apps`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateSimpleAppByIdApi = (parameter_id: string, payload: {name: string; value: string}) => {
  return apiHub.put<ISimpleApp>(`api/v1/simple-apps/${parameter_id}`, payload);
};

export const deleteSimpleAppByIdApi = (parameter_id: string) => {
  return apiHub.delete<ISimpleApp>(`api/v1/simple-apps/${parameter_id}`);
};

export const getSimpleAppsNameApi = () => {
  return apiHub.get<string[]>(`api/v1/simple-apps/names`);
};

//Wasp Apps Api
export const getWaspAppsApi = () => {
  return apiHub.get<IWaspApp[]>(`api/v1/wasp-apps`);
};

export const getWaspAppByIdApi = (wasp_id: string) => {
  return apiHub.get<IWaspApp>(`api/v1/wasp-apps/${wasp_id}`);
};

export const uploadNewWaspAppApi = (payload: FormData) => {
  return apiHub.post<IWaspApp>(`api/v1/wasp-apps`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateWaspAppByIdApi = () => {
  // return apiHub.put<IWaspApp>(`api/v1/wasp-apps/${parameter_id}`, payload);
};

export const deleteWaspAppByIdApi = (wasp_id: string) => {
  return apiHub.delete<IWaspApp>(`api/v1/wasp-apps/${wasp_id}`);
};
  
  export const getWaspAppSourceDocByChatIdAndWaspIdApi = (wasp_id: string,chat_message_id:string) => {
    return apiHub.get<string>(`api/v1/wasp-apps/${wasp_id}/${chat_message_id}/proxy-frontend`);
  };
