import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {isAxiosError} from 'axios';
import toast from 'react-hot-toast';

import {
  createScheduledPromptsApi,
  deleteScheduledPromptsApi,
  getAllScheduledPromptsApi,
  getScheduledPromptItemMessagesApi,
  updateScheduledPromptsApi,
} from '@/services/chat.service';
import {IChatMessage, IScheduledPrompts, TCreateScheduledPromptsBody} from '@/types';

type TScheduledPromptsStates = {
  entities: IScheduledPrompts[] | null;
  selectedScheduledPrompt: IScheduledPrompts | null;
  agentMessageEntities: IChatMessage[] | null;
  isLoading: boolean;
  hasError: boolean;
  openDeleteSchedulePromptDialog: boolean;
  openEditSchedulePromptDialog: boolean;
  errorMessage: string | undefined;
};

// Define the initial state using that type
const initialState: TScheduledPromptsStates = {
  entities: null,
  agentMessageEntities: null,
  selectedScheduledPrompt: null,
  isLoading: false,
  hasError: false,
  openDeleteSchedulePromptDialog: false,
  openEditSchedulePromptDialog: false,
  errorMessage: '',
};

const scheduledPrompts = createSlice({
  name: 'scheduledPrompts',
  initialState,
  reducers: {
    changeSelectedSchedulePrompt: (state, {payload}: PayloadAction<IScheduledPrompts | null>) => {
      if (!payload) {
        state.agentMessageEntities = null;
      }
      state.selectedScheduledPrompt = payload;
    },
    changeOpenEditSchedulePromptDialog: (state, {payload}: PayloadAction<boolean>) => {
      state.openEditSchedulePromptDialog = payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllScheduledPrompts.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = '';
      })
      .addCase(getAllScheduledPrompts.rejected, (state, action) => {
        state.hasError = true;
        state.isLoading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(getAllScheduledPrompts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entities = action.payload;
      })
      .addCase(getScheduledPromptItemMessages.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = '';
      })
      .addCase(getScheduledPromptItemMessages.rejected, (state, action) => {
        state.hasError = true;
        state.isLoading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(getScheduledPromptItemMessages.fulfilled, (state, action) => {
        console.log('getScheduledPromptItemMessages fulfilled');
        state.isLoading = false;
        state.agentMessageEntities = action.payload;
      })
      // .addCase(updateScheduledPrompt.fulfilled, (state, {payload}) => {
      //   console.log('updateScheduledPrompt fulfilled');
      //   state.isLoading = false;
      //   if (state.entities) {
      //     state.entities = [...state.entities].flatMap((document) =>
      //       document.id === payload.id ? payload : document,
      //     );
      //   }
      // })
      .addCase(deleteScheduledPrompt.fulfilled, (state, {payload}) => {
        console.log('deleteScheduledPrompt fulfilled');
        state.isLoading = false;
        if (state.entities) {
          state.entities = [...state.entities].filter((agent) => agent.id !== payload);
        }
      });
    // .addCase(createScheduledPrompts.fulfilled, (state, {payload}) => {
    //   console.log('createScheduledPrompts fulfilled');
    //   state.isLoading = false;
    //   // if (state.entities) {
    //   //   state.entities = [...state.entities, payload];
    //   // } else {
    //   //   // state.entities = [payload];
    //   // }
    // });
  },
});

// export const getAllDocuments = createAsyncThunk('/scheduledPrompts/getAllDocuments', async () => {
//   // try {
//   console.log('dispatch getAllDocuments runs');
//   const {data} = await getAllDocumentsApi();
//   return data;
// });
export const getAllScheduledPrompts = createAsyncThunk('/scheduledPrompts/getAllScheduledPrompts', async () => {
  const {data} = await getAllScheduledPromptsApi();
  return data;
});
// export const getScheduledPromptItemMessages = createAsyncThunk('/scheduledPrompts/getAllScheduledPrompts', async () => {
//   const {data} = await getScheduledPromptItemMessagesApi();
//   return data;
// });

export const getScheduledPromptItemMessages = createAsyncThunk(
  '/scheduledPrompts/getScheduledPromptItemMessages',
  async (id: string, {rejectWithValue}) => {
    try {
      const {data} = await getScheduledPromptItemMessagesApi(id);

      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.error || 'An error occurred');
        return rejectWithValue(error.response?.data || 'An error occurred');
      }

      // Handle non-Axios errors
      toast.error('An unexpected error occurred');
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

export const updateScheduledPrompt = createAsyncThunk(
  '/scheduledPrompts/updateScheduledPrompt',
  async (payload: {form: TCreateScheduledPromptsBody; agentId: string}, {rejectWithValue, dispatch}) => {
    try {
      const {data, status} = await updateScheduledPromptsApi(payload.form, payload.agentId);
      if (status === 200) {
        toast.success(`update Successful.`);
        dispatch(getAllScheduledPrompts());
      }

      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.error || 'An error occurred');
        return rejectWithValue(error.response?.data || 'An error occurred');
      }

      // Handle non-Axios errors
      toast.error('An unexpected error occurred');
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

export const createScheduledPrompts = createAsyncThunk(
  '/scheduledPrompts/createScheduledPrompts',
  async (form: TCreateScheduledPromptsBody, {rejectWithValue, dispatch}) => {
    try {
      const {data, status} = await createScheduledPromptsApi(form);
      if (status === 201) {
        toast.success(`The agent prompt has been added.`);
        dispatch(getAllScheduledPrompts());
      }

      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.error || 'An error occurred');
        return rejectWithValue(error.response?.data || 'An error occurred');
      }

      // Handle non-Axios errors
      toast.error('An unexpected error occurred');
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

export const deleteScheduledPrompt = createAsyncThunk(
  '/scheduledPrompts/deleteScheduledPrompt',
  async (payload: string, {rejectWithValue}) => {
    try {
      const {status} = await deleteScheduledPromptsApi(payload);
      if (status === 204) {
        toast.success(`document has successfully been removed.`);
        // dispatch(getAllDocuments());
      }
      return payload;
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.error || 'An error occurred');
        return rejectWithValue(error.response?.data || 'An error occurred');
      }

      // Handle non-Axios errors
      toast.error('An unexpected error occurred');
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

export const {changeOpenEditSchedulePromptDialog, changeSelectedSchedulePrompt} = scheduledPrompts.actions;
export default scheduledPrompts.reducer;
