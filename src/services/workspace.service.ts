import {IWorkspace} from '@/types/workspace';

import apiHub from '../hooks/useApiClient';

export const getWorkspaces = async () => {
  return apiHub.get<IWorkspace[]>('/api/v1/workspaces');
};
