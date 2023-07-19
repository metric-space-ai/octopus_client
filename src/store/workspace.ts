import {create} from 'zustand';
import {persist} from 'zustand/middleware';

import {getWorkspaces} from '@/services/workspace.service';
import {IWorkspace} from '@/types/workspace';

interface WorkspaceStore {
  workspaces: IWorkspace[];
  getWorkspaces: () => void;
  loading: boolean;
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set) => ({
      workspaces: [],
      loading: false,
      getWorkspaces() {
        getWorkspaces().then((res) => {
          set({workspaces: res.data});
        });
      },
    }),
    {
      name: 'WorkspaceStore',
    },
  ),
);
