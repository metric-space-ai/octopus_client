import {AxiosError} from 'axios';
import toast from 'react-hot-toast';
import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import {
  getWaspAppsApi,
  getWaspAppByIdApi,
  uploadNewWaspAppApi,
  updateWaspAppByIdApi,
  deleteWaspAppByIdApi,
  getWaspAppSourceDocByChatIdAndWaspIdApi,
} from '@/services/settings.service';
import {IChatMessage, IWaspApp, ValidationErrors} from '@/types';

interface WaspAppsStates {
  entities: IWaspApp[] | null;
  app_src: string;
  isLoading: boolean;
  reloadWaspAppIsAvailable: boolean;
  hasError: boolean;
  errorMessage: string | undefined;
  uploadIsLoading: boolean;
  editIsLoading: boolean;
  uploadSucceeded: boolean;
}
// Define the initial state using that type
const initialState: WaspAppsStates = {
  entities: null,
  app_src: '',
  isLoading: false,
  hasError: false,
  reloadWaspAppIsAvailable: false,
  errorMessage: '',
  uploadIsLoading: false,
  editIsLoading: false,
  uploadSucceeded: false,
};

const waspAppsSlice = createSlice({
  name: 'waspApps',
  initialState,
  reducers: {
    setUploadIsLoading: (state, action: PayloadAction<boolean>) => {
      state.uploadIsLoading = action.payload;
    },
    setUploadSucceeded: (state, action: PayloadAction<boolean>) => {
      state.uploadSucceeded = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllWaspApps.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = '';
      })
      .addCase(getAllWaspApps.rejected, (state, action) => {
        state.hasError = true;
        state.isLoading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(getAllWaspApps.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entities = action.payload;
      })
      .addCase(updateWaspApp.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        if (state.entities) {
          state.entities = [...state.entities].flatMap((app) => (app.id === payload.id ? payload : app));
        }
      })
      .addCase(deleteWaspAppById.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        if (state.entities) {
          state.entities = [...state.entities].filter((app) => app.id !== payload);
        }
      })
      .addCase(uploadNewWaspApp.pending, (state) => {
        state.uploadIsLoading = true;
        state.hasError = false;
        state.errorMessage = '';
        state.uploadSucceeded = false;
      })
      .addCase(uploadNewWaspApp.rejected, (state, action) => {
        state.hasError = true;
        state.isLoading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(uploadNewWaspApp.fulfilled, (state, {payload}) => {
        state.uploadIsLoading = false;
        state.uploadSucceeded = true;
        if (state.entities) {
          state.entities = [...state.entities, payload];
        } else {
          state.entities = [payload];
        }
      })
      .addCase(getWaspAppSourceDocByChatIdAndWaspId.pending, (state) => {
        state.hasError = false;
        state.errorMessage = '';
        state.isLoading = true;
      })
      .addCase(getWaspAppSourceDocByChatIdAndWaspId.rejected, (state, action) => {
        state.hasError = true;
        state.isLoading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(getWaspAppSourceDocByChatIdAndWaspId.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        if (payload) {
          state.app_src = payload;
          console.log({getWaspAppSourceDocByChatIdAndWaspId:payload})
        }
      });
  },
});

export const getAllWaspApps = createAsyncThunk('/waspApps/getAllWaspApps', async () => {
  // try {

  const {data} = await getWaspAppsApi();
  return data;
});

export const getWaspAppById = createAsyncThunk(
  '/waspApps/getWaspAppById',
  async (wasp_id: string, {rejectWithValue}) => {
    try {
      const {status, data} = await getWaspAppByIdApi(wasp_id);
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

export const getWaspAppSourceDocByChatIdAndWaspId = createAsyncThunk(
  '/waspApps/getWaspAppSourceDocByChatIdAndWaspId',
  async ({id, wasp_app_id}: IChatMessage, {rejectWithValue}) => {
    if (!wasp_app_id) return;
    try {
      const {status, data} = await getWaspAppSourceDocByChatIdAndWaspIdApi(wasp_app_id, id);
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

export const updateWaspApp = createAsyncThunk(
  '/waspApps/updateWaspApp',
  async (payload: IWaspApp, {rejectWithValue}) => {
    try {
      const {status, data} = await updateWaspAppByIdApi(payload);
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

export const uploadNewWaspApp = createAsyncThunk(
  '/waspApps/uploadNewWaspApp',
  async (payload: FormData, {rejectWithValue, dispatch}) => {
    try {
      const {data, status} = await uploadNewWaspAppApi(payload);
      if (status === 201) toast.success(`The new app has been added.`);
      dispatch(getAllWaspApps());
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

export const deleteWaspAppById = createAsyncThunk(
  '/waspApps/deleteWaspAppById',
  async (payload: string, {rejectWithValue, dispatch}) => {
    try {
      const {status} = await deleteWaspAppByIdApi(payload);
      if (status === 204) {
        toast.success(`app has successfully been removed.`);
        dispatch(getAllWaspApps());
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
export const {setUploadIsLoading, setUploadSucceeded} = waspAppsSlice.actions;

export default waspAppsSlice.reducer;
