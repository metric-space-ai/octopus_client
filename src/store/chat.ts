import {create} from 'zustand';
import {persist} from 'zustand/middleware';

import {
  createChatMessageApi,
  createTicketApi,
  deleteTicketApi,
  getChatMessagesApi,
  getTicketsApi,
  getWorkspacesApi,
} from '@/services/chat.service';
import {IChatMessage, ITicket, IWorkspace} from '@/types';

interface ChatStore {
  workspaces: IWorkspace[];
  tickets: ITicket[];
  currentWorkspaceId: string;
  currentTicketId: string;
  isNewTicket: boolean;
  messages: IChatMessage[];
  loading: boolean;
  getWorkspaces: () => void;
  setWorkspaceId: (idx: string) => void;
  selectTicketId: (idx: string) => void;
  newTicket: () => void;
  deleteTicket: (idx: string) => void;
  newMessage: (message: string) => Promise<void>;
  updateMessage: (chatMessage: IChatMessage) => void;
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
        set({loading: true});
        getTicketsApi(idx)
          .then((res) => {
            const currentIdx = get().currentTicketId;
            set({tickets: res.data});
            if (res.data.length > 0) {
              if (!res.data.some((ticket) => ticket.id === currentIdx)) {
                get().selectTicketId(res.data[0].id);
              }
            } else {
              set({currentTicketId: ''});
              set({messages: []});
              set({loading: false});
            }
          })
          .catch(() => {
            set({tickets: []});
            set({loading: false});
          });
      },
      selectTicketId(idx: string) {
        set({loading: true});
        set({currentTicketId: idx});
        set({isNewTicket: false});
        getChatMessagesApi(idx)
          .then((res) => {
            set({messages: res.data});
          })
          .catch((e) => {
            // catch
            console.log(e);
          })
          .finally(() => {
            set({loading: false});
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
      async newMessage(message: string) {
        const isNewTicket = get().isNewTicket;
        const currentWorkspaceId = get().currentWorkspaceId;
        const currentTicketId = get().currentTicketId;
        if (isNewTicket || !currentTicketId) {
          // create new ticket
          set({messages: []});
          createTicketApi(currentWorkspaceId)
            .then((res) => {
              const ticketId = res.data.id;
              // send new message
              createChatMessageApi(ticketId, message).then((res) => {
                const messages = get().messages;
                set({messages: [...messages, {...res.data}]});
                set({isNewTicket: false});
              });
            })
            .catch((e) => {
              console.log(e);
            });
        } else if (currentTicketId) {
          createChatMessageApi(currentTicketId, message).then((res) => {
            const messages = get().messages;
            set({messages: [...messages, {...res.data}]});
            set({isNewTicket: false});
          });
        }
      },
      updateMessage(chatMessage: IChatMessage) {
        const messages = get().messages;
        const tickets = get().tickets;
        const existingTicket = tickets.some((ticket) => ticket.id === chatMessage.chat_id);
        if (!existingTicket) {
          getTicketsApi(get().currentWorkspaceId).then((res) => {
            set({tickets: res.data, currentTicketId: chatMessage.chat_id});
          });
        }
        const index = messages.findIndex((message) => message.id === chatMessage.id);
        if (index !== -1) {
          messages[index] = chatMessage;
          set({messages});
        }
      },
    }),
    {
      name: 'ChatStore',
    },
  ),
);
