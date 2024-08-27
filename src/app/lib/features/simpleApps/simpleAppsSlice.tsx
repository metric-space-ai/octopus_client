import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {isAxiosError} from 'axios';
import toast from 'react-hot-toast';

import {deleteSimpleAppByIdApi, getSimpleAppsApi, uploadNewSimpleAppApi} from '@/services/settings.service';
import {ISimpleApp} from '@/types';

interface SimpleAppsStates {
  entities: ISimpleApp[] | null;
  isLoading: boolean;
  reloadSimpleAppIsAvailable: boolean;
  hasError: boolean;
  errorMessage: string | undefined;
  uploadIsLoading: boolean;
  editIsLoading: boolean;
  uploadSucceeded: boolean;
}
// Define the initial state using that type
const initialState: SimpleAppsStates = {
  entities: null,
  isLoading: false,
  hasError: false,
  reloadSimpleAppIsAvailable: false,
  errorMessage: '',
  uploadIsLoading: false,
  editIsLoading: false,
  uploadSucceeded: false,
};

const simpleAppsSlice = createSlice({
  name: 'simpleApps',
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
      .addCase(getAllSimpleApps.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = '';
      })
      .addCase(getAllSimpleApps.rejected, (state, action) => {
        state.hasError = true;
        state.isLoading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(getAllSimpleApps.fulfilled, (state, action) => {
        console.log('getAllSimpleApps fulfilled');
        state.isLoading = false;
        state.entities = action.payload;
      })
      .addCase(updateSimpleApp.fulfilled, (state) => {
        console.log('updateSimpleApp fulfilled');
        state.isLoading = false;
        if (state.entities) {
          // state.entities = [...state.entities].flatMap((member) => (member.id === payload.id ? payload : member));
        }
      })
      .addCase(deleteSimpleAppById.fulfilled, (state) => {
        console.log('deleteSimpleAppById fulfilled');
        state.isLoading = false;
        if (state.entities) {
          // state.entities = [...state.entities].filter((member) => member.id !== payload);
        }
      })
      .addCase(uploadNewSimpleApp.pending, (state) => {
        state.uploadIsLoading = true;
        state.hasError = false;
        state.errorMessage = '';
        state.uploadSucceeded = false;
        console.log('uploadNewSimpleApp.pending');
      })
      .addCase(uploadNewSimpleApp.rejected, (state, action) => {
        state.hasError = true;
        state.isLoading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(uploadNewSimpleApp.fulfilled, (state, {payload}) => {
        console.log('uploadNewSimpleApp fulfilled');
        state.uploadIsLoading = false;
        state.uploadSucceeded = true;
        if (state.entities) {
          state.entities = [...state.entities, payload];
        } else {
          state.entities = [payload];
        }
      });
  },
});

export const getAllSimpleApps = createAsyncThunk('/simpleApps/getAllSimpleApps', async () => {
  const {data} = await getSimpleAppsApi();
  return data;
});

export const updateSimpleApp = createAsyncThunk(
  '/simpleApps/updateSimpleApp',
  async (member: ISimpleApp, {rejectWithValue}) => {
    try {
      // const {status, data} = await updateSimpleAppByIdApi(member);
      // if (status === 200) toast.success(`Successful update.`);
      // return data;
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

export const uploadNewSimpleApp = createAsyncThunk(
  '/simpleApps/uploadNewSimpleApp',
  async (payload: FormData, {rejectWithValue, dispatch}) => {
    try {
      const {data, status} = await uploadNewSimpleAppApi(payload);
      if (status === 201) toast.success(`The new app has been added.`);
      dispatch(getAllSimpleApps());
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

export const deleteSimpleAppById = createAsyncThunk(
  '/simpleApps/deleteSimpleAppById',
  async (payload: string, {rejectWithValue, dispatch}) => {
    try {
      const {status} = await deleteSimpleAppByIdApi(payload);
      if (status === 204) {
        toast.success(`app has successfully been removed.`);
        dispatch(getAllSimpleApps());
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
export const {setUploadIsLoading, setUploadSucceeded} = simpleAppsSlice.actions;

export default simpleAppsSlice.reducer;
