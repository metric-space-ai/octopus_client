import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {isAxiosError} from 'axios';
import toast from 'react-hot-toast';

import {
  deleteWaspAppByIdApi,
  fullUpdateWaspAppApi,
  getWaspAppByIdApi,
  getWaspAppSourceDocByChatIdAndWaspIdApi,
  getWaspAppsApi,
  putAllowedUsersForWaspAppAccessApi,
  updateWaspAppByIdApi,
  uploadNewWaspAppApi,
} from '@/services/settings.service';
import {IChatMessage, IWaspApp} from '@/types';

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
  reloadWaspIsAvailable: boolean;
  selectedWaspApp: IWaspApp | null;
  openRemoveWaspAppDialog: boolean;
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
  reloadWaspIsAvailable: false,
  selectedWaspApp: null,
  openRemoveWaspAppDialog: false,
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
    handleChangeSelectedWaspApp: (state, {payload}: PayloadAction<IWaspApp | null>) => {
      state.selectedWaspApp = payload;
    },
    handleChangeOpenRemoveWaspAppDialog: (state, {payload}: PayloadAction<boolean>) => {
      state.openRemoveWaspAppDialog = payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllWaspApps.pending, (state) => {
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
      .addCase(fullUpdateWaspApp.pending, (state) => {
        state.uploadIsLoading = true;
        state.hasError = false;
        state.errorMessage = '';
        state.uploadSucceeded = false;
      })
      .addCase(fullUpdateWaspApp.rejected, (state, action) => {
        state.hasError = true;
        state.uploadIsLoading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(fullUpdateWaspApp.fulfilled, (state, {payload}) => {
        state.uploadIsLoading = false;
        state.uploadSucceeded = true;
        console.log('fullUpdateWaspApp... fullfiled');
        if (payload) {
          if (state.entities) {
            state.entities = [...state.entities.flatMap((elem) => (elem.id === payload.id ? payload : elem))];
          } else {
            state.entities = [payload];
          }
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
          console.log({getWaspAppSourceDocByChatIdAndWaspId: payload});
        }
      })
      .addCase(putAllowedUsersForWaspAppAccess.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        if (state.entities && payload) {
          state.entities = [...state.entities].flatMap((wasp_app) =>
            wasp_app.id === payload.id ? {...payload} : wasp_app,
          );
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
      const {data} = await getWaspAppByIdApi(wasp_id);
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

export const getWaspAppSourceDocByChatIdAndWaspId = createAsyncThunk(
  '/waspApps/getWaspAppSourceDocByChatIdAndWaspId',
  async ({id, wasp_app_id}: Pick<IChatMessage, 'wasp_app_id' | 'id'>, {rejectWithValue}) => {
    if (!wasp_app_id) return;
    try {
      const {data} = await getWaspAppSourceDocByChatIdAndWaspIdApi({wasp_app_id, id});
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

export const updateWaspApp = createAsyncThunk(
  '/waspApps/updateWaspApp',
  async (payload: IWaspApp, {rejectWithValue}) => {
    try {
      const {status, data} = await updateWaspAppByIdApi(payload);
      if (status === 200) toast.success(`Successful update.`);
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

export const fullUpdateWaspApp = createAsyncThunk(
  '/waspApps/fullUpdateWaspApp',
  async (payload: {formData: FormData; id: string}, {rejectWithValue, dispatch}) => {
    try {
      const {data, status} = await fullUpdateWaspAppApi(payload);
      if (status === 200) {
        toast.success(`wasp app successfully updated.`);
        dispatch(getAllWaspApps());
        return data;
      }
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

export const uploadNewWaspApp = createAsyncThunk(
  '/waspApps/uploadNewWaspApp',
  async (payload: FormData, {rejectWithValue, dispatch}) => {
    try {
      const {data, status} = await uploadNewWaspAppApi(payload);
      if (status === 201) toast.success(`The new app has been added.`);
      dispatch(getAllWaspApps());
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

type TWaspAppAllowAccess = {
  wasp_id: string;
  allowedUsers: string[] | [];
};
export const putAllowedUsersForWaspAppAccess = createAsyncThunk(
  '/aiServices/putAllowedUsersForWaspAppAccess',
  async ({wasp_id, allowedUsers}: TWaspAppAllowAccess, {rejectWithValue, dispatch}) => {
    try {
      const {status, data} = await putAllowedUsersForWaspAppAccessApi(wasp_id, allowedUsers);
      if (status === 200) {
        toast.success('updated successfully');
        return data;
      } else {
        dispatch(getAllWaspApps());
      }
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

export const {
  setUploadIsLoading,
  setUploadSucceeded,
  handleChangeSelectedWaspApp,
  handleChangeOpenRemoveWaspAppDialog,
} = waspAppsSlice.actions;

export default waspAppsSlice.reducer;
