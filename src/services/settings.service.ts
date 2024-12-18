import {
  ChatTokenAuditCompanyReport,
  ChatTokenAuditCompanyReportRequestBody,
  IAIFunctions,
  IChatMessage,
  ICreateUser,
  IDocument,
  IFile,
  IModel,
  IParameter,
  IPlugin,
  IPluginActivation,
  IResources,
  ISimpleApp,
  ITokenAudit,
  IUser,
  IWaspApp,
  TDirectCallResponse,
  TLlmModel,
  TNextCluodDoc,
  TOllamaModel,
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

export const resetTeamMemberPasswordApi = async (token: string, password: string) => {
  const payload = {password, repeat_password: password};
  return apiHub.put(`api/v1/auth/${token}`, payload);
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

export const getServiceLogsByPluginIdApi = (plugin_id: string) => {
  return apiHub.get<string>(`api/v1/ai-services/${plugin_id}/logs?limit=150`);
};

export const startPluginInstallationApi = (plugin_id: string) => {
  return apiHub.put<IPlugin>(`api/v1/ai-services/${plugin_id}/installation`);
};

export const downloadOriginalFunctionBodyApi = (plugin_id: string) => {
  return apiHub.get<string>(`api/v1/ai-services/${plugin_id}/download-original-function-body`);
};

export const downloadProcessedFunctionBodyApi = (plugin_id: string) => {
  return apiHub.get<string>(`api/v1/ai-services/${plugin_id}/download-processed-function-body`);
};

export const addPluginConfigurationApi = ({id, ...payload}: Pick<IPlugin, 'id' | 'type' | 'device_map' | 'color'>) => {
  return apiHub.put<IPlugin>(`api/v1/ai-services/${id}/configuration`, payload);
};

export const putPluginConfigurationColorApi = ({id, color}: Pick<IPlugin, 'id' | 'color'>) => {
  return apiHub.put<IPlugin>(`api/v1/ai-services/${id}/color`, {color});
};

export const uploadNewPluginApi = (payload: FormData) => {
  return apiHub.post<IPlugin>(`api/v1/ai-services`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const changePluginActivitiesByPluginIdApi = (plugin_id: string, payload: IPluginActivation) => {
  return apiHub.post<string>(`api/v1/ai-services/${plugin_id}`, payload);
};

export const updatePluginByIdApi = (id: string, file: FormData) => {
  return apiHub.put<IPlugin>(`api/v1/ai-services/${id}`, file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
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
  return apiHub.put<IAIFunctions>(`api/v1/ai-functions/${ai_service_id}/${ai_function_id}`, payload);
};

export const getServerResourcesApi = () => {
  return apiHub.get<IResources>(`api/v1/server-resources`);
};

export const getAllDocumentsApi = () => {
  return apiHub.get<IDocument[]>(`api/v1/nextcloud-files`);
};

export const getAllNextCloudDocumentsApi = () => {
  return apiHub.get<TNextCluodDoc[]>(`api/v1/nextcloud-raw-files`);
};

export const createNewNextCloudDocumentsApi = (payload: FormData) => {
  return apiHub.post<TNextCluodDoc>(`api/v1/nextcloud-raw-files`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const pdfToMarkdownApi = async (fileString: string) => {
  const payload = {
    name: 'pdf2markdown',
    parameters: {
      file: fileString,
    },
  };
  return apiHub.post<TDirectCallResponse>(`api/v1/ai-functions/direct-call`, payload, {
    timeout: 120000, // 120 seconds
  });
};

export const updateDocumentByIdApi = (documentId: string, payload: Pick<IDocument, 'file_name'>) => {
  return apiHub.put<IDocument>(`api/v1/nextcloud-files/${documentId}`, payload);
};

export const deleteDocumentByIdApi = (document_id: string) => {
  return apiHub.delete<IDocument>(`api/v1/nextcloud-files/${document_id}`);
};

export const getParametersApi = () => {
  return apiHub.get<IParameter[]>(`api/v1/parameters`);
};

export const getParameterByIdApi = (parameter_id: string) => {
  return apiHub.get<IParameter>(`api/v1/parameters/${parameter_id}`);
};

export const createNewParameterApi = (payload: Pick<IParameter, 'name' | 'value'>) => {
  return apiHub.post<IParameter>(`api/v1/parameters`, payload);
};

export const updateParameterByIdApi = (parameter_id: string, payload: Pick<IParameter, 'name' | 'value'>) => {
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

//Tokens Audits Api
export const getChatTokenAuditsApi = () => {
  return apiHub.get<ITokenAudit[]>(`api/v1/chat-token-audits`);
};
export const getChatTokenAuditsCompanyReportApi = ({
  company_id,
  ends_at,
  starts_at,
}: ChatTokenAuditCompanyReportRequestBody) => {
  return apiHub.get<ChatTokenAuditCompanyReport>(
    `api/v1/chat-token-audits/${company_id}/report?ends_at=${ends_at}&starts_at=${starts_at}`,
  );
};

//Files Api
export const getAllFilesApi = () => {
  return apiHub.get<IFile[]>(`api/v1/files`);
};
export const CreateNewFileApi = (file: FormData) => {
  return apiHub.post<IFile>(`api/v1/files`, file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const UpdateFileByIdApi = ({id, file}: {id: string; file: FormData}) => {
  return apiHub.put<IFile>(`api/v1/files/${id}`, file, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const deleteFileByIdApi = (id: string) => {
  return apiHub.delete<null>(`api/v1/files/${id}`);
};

//llm Api
export const getllmModelsApi = () => {
  return apiHub.get<TLlmModel>(`api/v1/llms`);
};

//Models Api
export const getOllamaModelsApi = () => {
  return apiHub.get<TOllamaModel[]>(`api/v1/ollama-models/models`);
};
export const getAllModelsApi = () => {
  return apiHub.get<IModel[]>(`api/v1/ollama-models`);
};
export const CreateNewModelApi = (name: string) => {
  return apiHub.post<IModel>(`api/v1/ollama-models`, {name});
};
export const UpdateModelByIdApi = ({id, name}: Pick<IModel, 'id' | 'name'>) => {
  return apiHub.put<IModel>(`api/v1/ollama-models/${id}`, {name});
};
export const deleteModelByIdApi = (id: string) => {
  return apiHub.delete<null>(`api/v1/ollama-models/${id}`);
};

//Wasp Apps Api
export const getWaspAppsApi = () => {
  return apiHub.get<IWaspApp[]>(`api/v1/wasp-apps`);
};

export const getWaspAppByIdApi = (wasp_id: string) => {
  return apiHub.get<IWaspApp>(`api/v1/wasp-apps/${wasp_id}`);
};

export const extractMetaUploadNewWaspAppApi = (payload: FormData) => {
  return apiHub.post<{title: string; description: string}>(`api/v1/wasp-apps/extract-meta`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const uploadNewWaspAppApi = (payload: FormData) => {
  return apiHub.post<IWaspApp>(`api/v1/wasp-apps`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const fullUpdateWaspAppApi = ({id, formData}: {formData: FormData; id: string}) => {
  return apiHub.put<IWaspApp>(`api/v1/wasp-apps/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const putAllowedUsersForWaspAppAccessApi = (wasp_app_id: string, allowed_user_ids: string[]) => {
  return apiHub.put<IWaspApp>(`api/v1/wasp-apps/${wasp_app_id}/allowed-users`, {allowed_user_ids});
};

export const updateWaspAppByIdApi = (wasp_app: IWaspApp) => {
  const {id, name, description, is_enabled} = wasp_app;
  return apiHub.put<IWaspApp>(
    `api/v1/wasp-apps/${id}`,
    {name, description, is_enabled},
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
};

export const deleteWaspAppByIdApi = (wasp_id: string) => {
  return apiHub.delete<IWaspApp>(`api/v1/wasp-apps/${wasp_id}`);
};

export const getWaspAppSourceDocByChatIdAndWaspIdApi = ({
  wasp_app_id,
  id,
}: Pick<IChatMessage, 'wasp_app_id' | 'id'>) => {
  return apiHub.get<string>(`api/v1/wasp-apps/${wasp_app_id}/${id}/proxy-frontend`);
};

export const getWaspAppLogsSourceDocByChatIdAndWaspIdApi = ({
  wasp_app_id,
  id,
}: Pick<IChatMessage, 'wasp_app_id' | 'id'>) => {
  return apiHub.get<string>(`api/v1/wasp-apps/${wasp_app_id}/${id}/logs`);
};

export const getAppVersionApi = () => {
  return apiHub.get<{version: string}>(`api/v1/version`);
};
