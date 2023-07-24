import {create} from 'zustand';
import {persist} from 'zustand/middleware';

import {deleteTicketApi, getChatMessagesApi, getTicketsApi, getWorkspacesApi} from '@/services/chat.service';
import {IChatMessage, ITicket, IWorkspace} from '@/types';

interface ChatStore {
  workspaces: IWorkspace[];
  tickets: ITicket[];
  currentWorkspaceId: string;
  currentTicketId: string;
  isNewTicket: boolean;
  messages: IChatMessage[];
  getWorkspaces: () => void;
  setWorkspaceId: (idx: string) => void;
  selectTicketId: (idx: string) => void;
  newTicket: () => void;
  deleteTicket: (idx: string) => void;
  loading: boolean;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      workspaces: [],
      tickets: [],
      currentWorkspaceId: '',
      currentTicketId: '',
      isNewTicket: false,
      messages: [],
      loading: false,
      getWorkspaces() {
        getWorkspacesApi().then((res) => {
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
        getTicketsApi(idx)
          .then((res) => {
            const currentIdx = get().currentTicketId;
            set({tickets: res.data});
            if (res.data.length > 0) {
              if (!res.data.some((ticket) => ticket.id === currentIdx)) {
                get().selectTicketId(res.data[0].id);
              }
            }
          })
          .catch(() => {
            set({tickets: []});
          });
      },
      selectTicketId(idx: string) {
        set({currentTicketId: idx});
        getChatMessagesApi(idx).then((res) => {
          set({messages: res.data});
        });
      },
      newTicket() {
        set({isNewTicket: true});
      },
      deleteTicket(idx: string) {
        const currentIdx = get().currentWorkspaceId;
        deleteTicketApi(currentIdx, idx).then(() => {
          const updatedTickets = get().tickets.filter((ticket) => ticket.id !== idx);
          set({tickets: updatedTickets});
        });
      },
      newMessage() {
        
      },
    }),
    {
      name: 'WorkspaceStore',
    },
  ),
);
