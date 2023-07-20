import {ITicket, IWorkspace} from '@/types';

import apiHub from '../hooks/useApiClient';

export const getWorkspaces = async () => {
  return apiHub.get<IWorkspace[]>('/api/v1/workspaces');
};

export const getTickets = async (workspaceId: string) => {
  return apiHub.get<ITicket[]>(`/api/v1/chats/${workspaceId}`);
};
