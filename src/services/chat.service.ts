import {ITicket, IWorkspace} from '@/types';

import apiHub from '../hooks/useApiClient';

export const getWorkspacesApi = async () => {
  return apiHub.get<IWorkspace[]>('/api/v1/workspaces');
};

export const getTicketsApi = async (workspaceId: string) => {
  return apiHub.get<ITicket[]>(`/api/v1/chats/${workspaceId}`);
};

export const deleteTicketApi = async (workspaceId: string, ticketId: string) => {
  return apiHub.delete(`/api/v1/chats/${workspaceId}/${ticketId}`);
};
