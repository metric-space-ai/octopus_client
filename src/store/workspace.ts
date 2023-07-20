import {create} from 'zustand';
import {persist} from 'zustand/middleware';

import {getWorkspaces} from '@/services/workspace.service';
import {IWorkspace} from '@/types/workspace';

interface WorkspaceStore {
  workspaces: IWorkspace[];
  currentWorkspaceId: string;
  getWorkspaces: () => void;
  setWorkspaceId: (idx: string) => void;
  loading: boolean;
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set, get) => ({
      workspaces: [],
      currentWorkspaceId: '',
      loading: false,
      getWorkspaces() {
        getWorkspaces().then((res) => {
          const currentIdx = get().currentWorkspaceId;
          set({workspaces: res.data});
          if (!res.data.some((workspace) => workspace.id === currentIdx)) {
            set({currentWorkspaceId: res.data[0].id});
          }
        });
      },
      setWorkspaceId(idx: string) {
        set({currentWorkspaceId: idx});
      },
    }),
    {
      name: 'WorkspaceStore',
    },
  ),
);
