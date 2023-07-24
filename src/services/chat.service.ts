import {IChatMessage, ITicket, IWorkspace} from '@/types';

import apiHub from '../hooks/useApiClient';

export const getWorkspacesApi = async () => {
  return apiHub.get<IWorkspace[]>('/api/v1/workspaces');
};

export const getTicketsApi = async (workspaceId: string) => {
  return apiHub.get<ITicket[]>(`/api/v1/chats/${workspaceId}`);
};

export const createTicketApi = async (workspaceId: string) => {
  return apiHub.post<ITicket>(`/api/v1/chats/${workspaceId}`);
};

export const deleteTicketApi = async (workspaceId: string, ticketId: string) => {
  return apiHub.delete(`/api/v1/chats/${workspaceId}/${ticketId}`);
};

export const createChatMessageApi = async (chatId: string, message: string) => {
  const payload = {message};
  return apiHub.post<IChatMessage>(`/api/v1/chat-messages/${chatId}`, payload);
};

export const getChatMessageApi = async (chatId: string, chatMessageId: string) => {
  return apiHub.get<IChatMessage>(`/api/v1/chat-messages/${chatId}/${chatMessageId}`);
};
