import {create} from 'zustand';
import {persist} from 'zustand/middleware';

import {getTickets, getWorkspaces} from '@/services/chat.service';
import {ITicket, IWorkspace} from '@/types';

interface ChatStore {
  workspaces: IWorkspace[];
  tickets: ITicket[];
  currentWorkspaceId: string;
  currentTicketId: string;
  getWorkspaces: () => void;
  setWorkspaceId: (idx: string) => void;
  setTicketId: (idx: string) => void;
  loading: boolean;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      workspaces: [],
      tickets: [],
      currentWorkspaceId: '',
      currentTicketId: '',
      loading: false,
      getWorkspaces() {
        getWorkspaces().then((res) => {
          const currentIdx = get().currentWorkspaceId;
          set({workspaces: res.data});
          if (res.data.length > 0) {
            if (!res.data.some((workspace) => workspace.id === currentIdx)) {
              get().setWorkspaceId(res.data[0].id);
            }
          }
        });
      },
      setWorkspaceId(idx: string) {
        set({currentWorkspaceId: idx});
        getTickets(idx).then((res) => {
          const currentIdx = get().currentTicketId;
          set({tickets: res.data});
          if (res.data.length > 0) {
            if (!res.data.some((ticket) => ticket.id === currentIdx)) {
              get().setWorkspaceId(res.data[0].id);
            }
          }
        });
      },
      setTicketId(idx: string) {
        set({currentTicketId: idx});
      },
    }),
    {
      name: 'WorkspaceStore',
    },
  ),
);
