import {AxiosError} from 'axios';
import toast from 'react-hot-toast';
import {create} from 'zustand';

import {
  RenameTicketApi,
  createChatMessageApi,
  createTicketApi,
  createWorkspaceApi,
  deleteChatMessageApi,
  deleteContentSafetyApi,
  deleteTicketApi,
  deleteWorkspaceApi,
  getChatMessagesApi,
  getContentSafetyApi,
  getLatestChatMessageApi,
  getTicketsApi,
  getWorkspacesApi,
  replaceMessageWithAnonymizedApi,
  replaceMessageWithNotSensitiveApi,
  updateChatMessageApi,
  updateContentSafetyApi,
  updateWorkspaceApi,
} from '@/services/chat.service';
import {
  IAIFunctions,
  IChatMessage,
  IContentSafety,
  ICreateMessageBody,
  IModel,
  ITicket,
  IWaspApp,
  IWorkspace,
  TLlmSelected,
} from '@/types';

interface ChatStore {
  workspaces: IWorkspace[];
  tickets: ITicket[];
  currentWorkspaceId: string;
  currentTicketId: string;
  isNewTicket: boolean;
  messages: IChatMessage[];
  loading: boolean;
  contentSafetyDetails: IContentSafety;
  enabledContentSafety: boolean;
  inputIsDesabled: boolean;

  selectedManualWaspApp: IWaspApp | undefined;
  selectedManualOllamaModel: IModel | undefined;
  selectedManualAiFunc: IAIFunctions | undefined;
  selectedManualLlm: TLlmSelected | undefined;
  setSelectedManualWaspApp: (value: IWaspApp | undefined) => void;
  setSelectedManualOllamaModel: (value: IModel | undefined) => void;
  setSelectedManualAiFunc: (value: IAIFunctions | undefined) => void;
  setSelectedManualLlm: (value: TLlmSelected | undefined) => void;

  checkChatInputIsDisabled: () => void;
  createNewWorkspace: (name: string, type: string) => void;
  updateWorkspace: (idx: string, name: string, type: string) => void;
  deleteWorkspace: (idx: string) => void;
  getWorkspaces: () => void;
  setWorkspaceId: (idx: string) => void;
  selectTicketId: (idx: string) => void;
  changeNewTicketToggle: (toggle?: boolean) => void;
  deleteTicket: (idx: string) => void;
  renameTicket: (idx: string, payload: {name: string}) => void;
  newMessage: (payload: ICreateMessageBody) => Promise<void>;
  editMessage: (chatMessage: IChatMessage, newMssage: string) => void;
  updateMessage: (chatMessage: IChatMessage) => void;
  deleteMessage: (chatMessage: IChatMessage, hasLoading?: boolean) => void;
  refreshMessage: (idx: string) => void;
  replaceMessageWithAnonymized: (chat_id: string, id: string) => void;
  replaceMessageWithNotSensitive: (chat_id: string, id: string) => void;
  // changeContentSafteyStatus: (status: boolean) => void;
  checkContentSafetyDetails: (contentSafety: IContentSafety) => void;
  getContentSafety: (user_id: string) => void;
  deleteContentSafety: (user_id: string) => void;
  updateContentSafety: (minutes: number, user_id: string) => void;
}

export const useChatStore = create<ChatStore>()((set, get) => ({
  selectedManualWaspApp: undefined,
  selectedManualOllamaModel: undefined,
  selectedManualAiFunc: undefined,
  selectedManualLlm: undefined,
  workspaces: [],
  tickets: [],
  contentSafetyDetails: {
    id: '',
    content_safety_disabled_until: '',
  },
  currentWorkspaceId: '',
  currentTicketId: '',
  isNewTicket: false,
  messages: [],
  loading: false,
  enabledContentSafety: true,
  inputIsDesabled: false,
  checkChatInputIsDisabled() {
    const messages = get().messages;
    const message = messages[messages.length - 1];
    const isSensitive =
      message.is_sensitive &&
      get().enabledContentSafety &&
      !message.is_anonymized &&
      !message.is_marked_as_not_sensitive;
    set({inputIsDesabled: isSensitive});
  },
  setSelectedManualWaspApp(value) {
    set({selectedManualWaspApp: value});
  },
  setSelectedManualOllamaModel(value) {
    set({selectedManualOllamaModel: value});
  },
  setSelectedManualAiFunc(value) {
    set({selectedManualAiFunc: value});
  },
  setSelectedManualLlm(value) {
    set({selectedManualLlm: value});
  },
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
  async updateWorkspace(idx: string, name: string, type: string) {
    updateWorkspaceApi(idx, name, type).then((res) => {
      const filteredWorkspaces =
        get().workspaces.flatMap((workspace) => (workspace.id === idx ? {...workspace, ...res.data} : workspace)) ?? [];
      set({workspaces: [...filteredWorkspaces]});
    });
  },
  deleteWorkspace(idx: string) {
    deleteWorkspaceApi(idx).then(() => {
      get().getWorkspaces();
    });
  },
  checkContentSafetyDetails(contentSafety: IContentSafety) {
    if (contentSafety && new Date(contentSafety.content_safety_disabled_until).getTime() > new Date().getTime()) {
      if (get().enabledContentSafety) {
        set({enabledContentSafety: false, contentSafetyDetails: contentSafety});
      } else {
        set({contentSafetyDetails: contentSafety});
      }
    } else {
      set({enabledContentSafety: true, contentSafetyDetails: contentSafety});
    }
  },
  async getContentSafety(user_id: string) {
    try {
      const {status, data} = await getContentSafetyApi(user_id);

      if (status === 200) {
        get().checkContentSafetyDetails(data);
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    }
  },
  async deleteContentSafety(user_id: string) {
    try {
      const {status, data} = await deleteContentSafetyApi(user_id);

      if (status === 204) {
        get().checkContentSafetyDetails(data);
        get().checkChatInputIsDisabled();
      } else {
        set({contentSafetyDetails: {id: '', content_safety_disabled_until: ''}});
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    }
  },
  async updateContentSafety(minutes: number, user_id: string) {
    try {
      const {status, data} = await updateContentSafetyApi(minutes, user_id);

      if (status === 201) {
        get().checkContentSafetyDetails(data);
        get().checkChatInputIsDisabled();
      } else {
        set({contentSafetyDetails: {id: '', content_safety_disabled_until: ''}});
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    }
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
        const message = res.data[res.data.length - 1];
        const inputIsDesabled =
          message.is_sensitive &&
          get().enabledContentSafety &&
          !message.is_anonymized &&
          !message.is_marked_as_not_sensitive;

        set({messages: res.data, inputIsDesabled});
      })
      .catch((e) => {
        // catch
        console.log(e);
      })
      .finally(() => {
        set({loading: false});
      });
  },
  changeNewTicketToggle(toggle = true) {
    set({isNewTicket: toggle});
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
  async renameTicket(idx: string, payload: {name: string}) {
    const currentIdx = get().currentWorkspaceId;
    try {
      const {status, data} = await RenameTicketApi(currentIdx, idx, payload);
      if (status === 200) {
        const result = [...get().tickets].flatMap((t) => (t.id === idx ? data : t));
        set({tickets: [...result]});
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    }
  },
  async newMessage(payload: ICreateMessageBody) {
    // async newMessage(message: string, sensitivty_check: boolean) {
    const isNewTicket = get().isNewTicket;
    const currentWorkspaceId = get().currentWorkspaceId;
    const currentTicketId = get().currentTicketId;
    // const bypass_sensitive_information_filter = sensitivty_check;
    if (isNewTicket || !currentTicketId) {
      // create new ticket
      set({messages: []});
      createTicketApi(currentWorkspaceId)
        .then((res) => {
          const ticketId = res.data.id;
          set({currentTicketId: ticketId});
          // send new message
          createChatMessageApi(ticketId, payload).then((res) => {
            const messages = get().messages;
            get().updateMessage(res.data);
            set({messages: [...messages, {...res.data}]});
            set({isNewTicket: false});
          });
        })
        .catch((e) => {
          console.log(e);
        });
    } else if (currentTicketId) {
      createChatMessageApi(currentTicketId, payload).then((res) => {
        const messages = get().messages;
        set({messages: [...messages, {...res.data}]});
        set({isNewTicket: false});
      });
    }
  },
  async editMessage(chatMessage: IChatMessage, newMssage: string) {
    const messages = get().messages;
    try {
      const {status, data} = await updateChatMessageApi(chatMessage.chat_id, chatMessage.id, newMssage);
      if (status === 200) {
        const result = messages.flatMap((message) => (message.id === chatMessage.id ? {...data} : message));
        set({messages: result});
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
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
  async replaceMessageWithNotSensitive(chat_id: string, id: string) {
    try {
      const {status, data} = await replaceMessageWithNotSensitiveApi(chat_id, id);
      if (status === 200) {
        const messages = get().messages;
        const result = messages.flatMap((message) => (message.id === id ? {...data} : message));
        set({messages: result});
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    }
  },
  async replaceMessageWithAnonymized(chat_id: string, id: string) {
    try {
      const {status, data} = await replaceMessageWithAnonymizedApi(chat_id, id);
      if (status === 200) {
        const messages = get().messages;
        const result = messages.flatMap((message) => (message.id === id ? {...data} : message));
        set({messages: result});
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    }
  },
  async deleteMessage(chatMessage: IChatMessage, hasLoading = true) {
    if (hasLoading) set({loading: true});

    try {
      const {status} = await deleteChatMessageApi(chatMessage.chat_id, chatMessage.id);
      if (status === 204) {
        const result = [...get().messages].filter((message) => message.id !== chatMessage.id);
        set({messages: result});
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
    } finally {
      if (hasLoading) set({loading: false});
    }
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
        } else {
          if (lastMessage.status === 'Asked' && res.data.status === 'Answered') {
            const result = messages.flatMap((message) => (message.id === res.data.id ? res.data : message));
            set({messages: result});
          }
        }
      }
    });
  },
}));
