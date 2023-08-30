import {create} from 'zustand';

import {
  createChatMessageApi,
  createTicketApi,
  createWorkspaceApi,
  deleteChatMessageApi,
  deleteTicketApi,
  deleteWorkspaceApi,
  getChatMessagesApi,
  getLatestChatMessageApi,
  getTicketsApi,
  getWorkspacesApi,
  updateChatMessageApi,
  updateWorkspaceApi,
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
  createNewWorkspace: (name: string, type: string) => void;
  updateWorkspace: (idx: string, name: string, type: string) => void;
  deleteWorkspace: (idx: string) => void;
  getWorkspaces: () => void;
  setWorkspaceId: (idx: string) => void;
  selectTicketId: (idx: string) => void;
  newTicket: () => void;
  deleteTicket: (idx: string) => void;
  newMessage: (message: string) => Promise<void>;
  editMessage: (chatMessage: IChatMessage, newMssage: string) => void;
  updateMessage: (chatMessage: IChatMessage) => void;
  deleteMessage: (chatMessage: IChatMessage) => void;
  refreshMessage: (idx: string) => void;
}

export const useChatStore = create<ChatStore>()((set, get) => ({
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
        if (res.data.some((workspace) => workspace.id === currentIdx)) {
          get().setWorkspaceId(currentIdx);
        } else {
          get().setWorkspaceId(res.data[0].id);
        }
      }
    });
  },
  createNewWorkspace(name: string, type: string) {
    createWorkspaceApi(name, type).then((res) => {
      set({workspaces: [...get().workspaces, res.data]});
      get().setWorkspaceId(res.data.id);
    });
  },
  updateWorkspace(idx: string, name: string, type: string) {
    updateWorkspaceApi(idx, name, type).then((res) => {
      const filteredWorkspaces = get().workspaces.filter((workspace) => workspace.id !== idx) ?? [];
      set({workspaces: [...filteredWorkspaces, res.data]});
    });
  },
  deleteWorkspace(idx: string) {
    deleteWorkspaceApi(idx).then(() => {
      get().getWorkspaces();
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
          if (res.data.some((ticket) => ticket.id === currentIdx)) {
            get().selectTicketId(currentIdx);
          } else {
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
      if (get().currentTicketId === idx) {
        if (updatedTickets.length > 0) {
          get().selectTicketId(updatedTickets[0].id);
        } else {
          set({messages: [], isNewTicket: true});
        }
      }
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
          set({currentTicketId: ticketId});
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
  editMessage(chatMessage: IChatMessage, newMssage: string) {
    const messages = get().messages;
    updateChatMessageApi(chatMessage.chat_id, chatMessage.id, newMssage).then((res) => {
      const index = messages.findIndex((message) => message.id === chatMessage.id);
      if (index !== -1) {
        messages[index] = res.data;
        set({messages});
      }
    });
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
  deleteMessage(chatMessage: IChatMessage) {
    deleteChatMessageApi(chatMessage.chat_id, chatMessage.id)
      .then(() => {
        // on success
      })
      .catch(() => {
        // on error
      })
      .finally(() => {
        const messages = get().messages;
        set({messages: messages.filter((m) => m.id !== chatMessage.id)});
      });
  },
  refreshMessage(chatId: string) {
    getLatestChatMessageApi(chatId).then((res) => {
      // on success
      const messages = get().messages;
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        const isLastMessage = lastMessage.id === res.data.id;
        if (!isLastMessage) {
          getChatMessagesApi(chatId).then((res) => {
            const currentTicketId = get().currentTicketId;
            const isNewTicket = get().isNewTicket;
            if (!isNewTicket && currentTicketId === chatId) {
              set({messages: res.data});
            }
          });
        }
      }
    });
  },
}));
