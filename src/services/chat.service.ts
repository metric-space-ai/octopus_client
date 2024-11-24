import axios from 'axios';

import {
  IChatMessage,
  IContentSafety,
  ICreateMessageBody,
  IScheduledPrompts,
  ISimpleApp,
  ITicket,
  IWorkspace,
  TCreateScheduledPromptsBody,
  TranslatorResponse,
  TranslatorType,
} from '@/types';

import apiHub from '../hooks/useApiClient';

//feedback-api
export const sendSlackMessageApi = async (message: unknown) => {
  // return apiHub.post<unknown>('api/sendSlackMessage', {message});
  const response = await axios.post('/api/sendSlackMessage', {message});
  return response.data;

  // const payload = {
  //   channel: NEXTPUBLICSLACKCHANNELID,
  //   text: message,
  // };

  // return apiHub.post<unknown>(NEXTPUBLICSLACKWEBHOOKURL ?? 'https://slack.com/api/chat.postMessage', payload, {
  //   headers: {
  //     Authorization: `Bearer ${NEXTPUBLICSLACKBOTTOKEN}`,
  //   },
  // });
};

//scheduled-prompts Api
export const getAllScheduledPromptsApi = () => {
  return apiHub.get<IScheduledPrompts[]>(`api/v1/scheduled-prompts`);
};
export const getScheduledPromptItemMessagesApi = (id: string) => {
  return apiHub.get<IChatMessage[]>(`api/v1/chat-messages/${id}`);
};

export const createScheduledPromptsApi = async (payload: TCreateScheduledPromptsBody) => {
  return apiHub.post<IScheduledPrompts>('api/v1/scheduled-prompts', payload);
};

export const deleteScheduledPromptsApi = async (id: string) => {
  return apiHub.delete(`api/v1/scheduled-prompts/${id}`);
};

export const updateScheduledPromptsApi = async (payload: TCreateScheduledPromptsBody, id: string) => {
  return apiHub.put<IScheduledPrompts>(`api/v1/scheduled-prompts/${id}`, payload);
};

export const createWorkspaceApi = async (name: string, type: string) => {
  const payload = {name, type};
  return apiHub.post<IWorkspace>('api/v1/workspaces', payload);
};

export const updateWorkspaceApi = async (idx: string, name: string, type: string) => {
  const payload = {name, type};
  return apiHub.put<IWorkspace>(`api/v1/workspaces/${idx}`, payload);
};

export const deleteWorkspaceApi = async (idx: string) => {
  return apiHub.delete(`api/v1/workspaces/${idx}`);
};

export const getWorkspacesApi = async () => {
  return apiHub.get<IWorkspace[]>('api/v1/workspaces');
};

export const getTicketsApi = async (workspaceId: string) => {
  return apiHub.get<ITicket[]>(`api/v1/chats/${workspaceId}`);
};

export const createTicketApi = async (workspaceId: string) => {
  return apiHub.post<ITicket>(`api/v1/chats/${workspaceId}`);
};

export const RenameTicketApi = async (workspaceId: string, ticketId: string, payload: {name: string}) => {
  return apiHub.put<ITicket>(`api/v1/chats/${workspaceId}/${ticketId}`, payload);
};

export const deleteTicketApi = async (workspaceId: string, ticketId: string) => {
  return apiHub.delete(`api/v1/chats/${workspaceId}/${ticketId}`);
};

export const getChatMessagesApi = async (ticketId: string) => {
  return apiHub.get<IChatMessage[]>(`api/v1/chat-messages/${ticketId}`);
};

export const getChatMessageApplicationApi = async (appId: string) => {
  return apiHub.get<ISimpleApp>(`api/v1/simple-apps/${appId}`);
};

export const getChatMessageApplicationCodeApi = async (appId: string) => {
  return apiHub.get<string>(`api/v1/simple-apps/${appId}/code`);
};

export const createChatMessageApi = async (ticketId: string, payload: ICreateMessageBody) => {
  return apiHub.post<IChatMessage>(`api/v1/chat-messages/${ticketId}`, payload);
};

export const updateChatMessageApi = async (
  chatId: string,
  chatMessageId: string,
  message: string,
  bypass_sensitive_information_filter = false,
) => {
  const payload = {message, bypass_sensitive_information_filter};
  return apiHub.put<IChatMessage>(`api/v1/chat-messages/${chatId}/${chatMessageId}`, payload);
};

export const replaceMessageWithNotSensitiveApi = async (chat_id: string, chat_message_id: string) => {
  return await apiHub.put<IChatMessage>(`/api/v1/chat-messages/${chat_id}/${chat_message_id}/not-sensitive`);
};

export const replaceMessageWithAnonymizedApi = async (chat_id: string, chat_message_id: string) => {
  return await apiHub.put<IChatMessage>(`api/v1/chat-messages/${chat_id}/${chat_message_id}/anonymize`);
};

export const getChatMessageApi = async (chatId: string, chatMessageId: string) => {
  return apiHub.get<IChatMessage>(`api/v1/chat-messages/${chatId}/${chatMessageId}`);
};

export const getLatestChatMessageApi = async (chatId: string) => {
  return apiHub.get<IChatMessage>(`api/v1/chat-messages/${chatId}/latest`);
};

export const deleteChatMessageApi = async (chatId: string, chatMessageId: string) => {
  return apiHub.delete<IChatMessage>(`api/v1/chat-messages/${chatId}/${chatMessageId}`);
};

export const directCall = async (data: TranslatorType) => {
  return apiHub.post<TranslatorResponse>(`api/v1/ai-functions/direct-call`, data);
};

export const updateContentSafetyApi = async (minutes: number, user_id: string) => {
  return await apiHub.post<IContentSafety>(`api/v1/inspection-disablings/${user_id}`, {minutes});
};

export const getContentSafetyApi = async (user_id: string) => {
  return await apiHub.get<IContentSafety>(`api/v1/inspection-disablings/${user_id}`);
};
export const deleteContentSafetyApi = async (user_id: string) => {
  return await apiHub.delete<IContentSafety>(`api/v1/inspection-disablings/${user_id}`);
};
