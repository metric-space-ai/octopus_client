import {AxiosError} from 'axios';
import toast from 'react-hot-toast';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import {
  createTeamMemberApi,
  deleteTeamMemberApi,
  getAllTeamMembersApi,
  updateTeamMemberApi,
} from '@/services/settings.service';
import {ICreateUser, IUser, ValidationErrors} from '@/types';

interface TeamMembersStates {
  entities: IUser[] | null;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | undefined;
}
// Define the initial state using that type
const initialState: TeamMembersStates = {
  entities: null,
  isLoading: false,
  hasError: false,
  errorMessage: '',
};

const teamMembersSlice = createSlice({
  name: 'teamMembers',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllTeamMembers.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = '';
      })
      .addCase(getAllTeamMembers.rejected, (state, action) => {
        state.hasError = true;
        state.isLoading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(getAllTeamMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entities = action.payload;
      })
      .addCase(updateTeamMember.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        if (state.entities) {
          state.entities = [...state.entities].flatMap((member) => (member.id === payload.id ? payload : member));
        }
      })
      .addCase(deleteTeamMember.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        if (state.entities) {
          state.entities = [...state.entities].filter((member) => member.id !== payload);
        }
      })
      .addCase(addNewTeamMember.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        if (state.entities) {
          state.entities = [...state.entities, payload];
        } else {
          state.entities = [payload];
        }
      });
  },
});

export const getAllTeamMembers = createAsyncThunk('/teamMembers/getAllTeamMembers', async () => {
  const {data} = await getAllTeamMembersApi();
  return data;
});

export const updateTeamMember = createAsyncThunk(
  '/teamMembers/updateTeamMember',
  async (member: IUser, {rejectWithValue}) => {
    try {
      const {status, data} = await updateTeamMemberApi(member);
      if (status === 200) toast.success(`Successful update.`);

      return data;
    } catch (err) {
      let error = err as AxiosError<ValidationErrors, any>;

      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  },
);

export const addNewTeamMember = createAsyncThunk(
  '/teamMembers/addNewTeamMember',
  async (member: ICreateUser, {rejectWithValue}) => {
    try {
      const {data, status} = await createTeamMemberApi(member);
      if (status === 201) toast.success(`The new user has been added.`);

      return data;
    } catch (err) {
      let error = err as AxiosError<ValidationErrors, any>;

      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteTeamMember = createAsyncThunk(
  '/teamMembers/deleteTeamMember',
  async (payload: string, {rejectWithValue}) => {
    try {
      const {status} = await deleteTeamMemberApi(payload);
      if (status === 204) {
        toast.success(`user has successfully been removed.`);
      }
      return payload;
    } catch (err) {
      let error = err as AxiosError<ValidationErrors, any>;

      if (err instanceof AxiosError) {
        toast.error(err?.response?.data.error);
      }
      if (!error.response) {
        throw error;
      }
      return rejectWithValue(error.response.data);
    }
  },
);

export default teamMembersSlice.reducer;
