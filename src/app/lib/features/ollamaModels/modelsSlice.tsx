import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {isAxiosError} from 'axios';
import toast from 'react-hot-toast';

import {
  CreateNewModelApi,
  UpdateModelByIdApi,
  deleteModelByIdApi,
  getAllModelsApi,
  getOllamaModelsApi,
} from '@/services/settings.service';
import {IModel, TOllamaModel} from '@/types';

interface ModelsStates {
  entities: IModel[] | null;
  ollamaModels: TOllamaModel[] | null;
  app_src: string;
  isLoading: boolean;
  ollamaIsLoading: boolean;
  CreateHasError: boolean;
  deleteModelIsLoading: boolean;
  createModelIsLoading: boolean;
  deleteHasError: boolean;
  reloadModelsIsAvailable: boolean;
  hasError: boolean;
  ollamaHasError: boolean;
  errorMessage: string | undefined;
  uploadIsLoading: boolean;
  editIsLoading: boolean;
  uploadSucceeded: boolean;
  reloadWaspIsAvailable: boolean;
  selectedModel: IModel | null;
  openRemoveModelDialog: boolean;
}
// Define the initial state using that type
const initialState: ModelsStates = {
  entities: null,
  ollamaModels: null,
  app_src: '',
  isLoading: false,
  ollamaIsLoading: false,
  CreateHasError: false,
  deleteModelIsLoading: false,
  createModelIsLoading: false,
  deleteHasError: false,
  hasError: false,
  ollamaHasError: false,
  reloadModelsIsAvailable: false,
  errorMessage: '',
  uploadIsLoading: false,
  editIsLoading: false,
  uploadSucceeded: false,
  reloadWaspIsAvailable: false,
  selectedModel: null,
  openRemoveModelDialog: false,
};

const modelsSlice = createSlice({
  name: 'models',
  initialState,
  reducers: {
    setUploadIsLoading: (state, action: PayloadAction<boolean>) => {
      state.uploadIsLoading = action.payload;
    },
    setUploadSucceeded: (state, action: PayloadAction<boolean>) => {
      state.uploadSucceeded = action.payload;
    },
    handleChangeSelectedModel: (state, {payload}: PayloadAction<IModel | null>) => {
      state.selectedModel = payload;
    },
    handleChangeOpenRemoveModelDialog: (state, {payload}: PayloadAction<boolean>) => {
      state.openRemoveModelDialog = payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllModels.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = '';
      })
      .addCase(getAllModels.rejected, (state, action) => {
        state.hasError = true;
        state.isLoading = false;
        state.reloadModelsIsAvailable = true;
        state.errorMessage = action.error.message;
      })
      .addCase(getAllModels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reloadModelsIsAvailable = false;
        state.entities = action.payload;
      })
      .addCase(getOllamaModels.pending, (state) => {
        state.ollamaIsLoading = true;
        state.ollamaHasError = false;
        state.errorMessage = '';
      })
      .addCase(getOllamaModels.rejected, (state, action) => {
        state.ollamaHasError = true;
        state.ollamaIsLoading = false;
        state.errorMessage = action.error.message ?? 'something when wrong';
      })
      .addCase(getOllamaModels.fulfilled, (state, action) => {
        state.ollamaIsLoading = false;
        state.ollamaModels = action.payload;
      })
      .addCase(createNewModel.pending, (state) => {
        state.createModelIsLoading = true;
        state.CreateHasError = false;
        state.errorMessage = '';
      })
      .addCase(createNewModel.rejected, (state, action) => {
        state.CreateHasError = true;
        state.createModelIsLoading = false;
        state.errorMessage = action.error.message ?? 'something when wrong';
      })
      .addCase(createNewModel.fulfilled, (state, action) => {
        state.createModelIsLoading = false;
        if (state.entities) {
          state.entities = [...state.entities, action.payload];
        } else {
          state.entities = [action.payload];
        }
      })
      .addCase(UpdateModelById.pending, (state) => {
        state.createModelIsLoading = true;
        state.CreateHasError = false;
        state.errorMessage = '';
      })
      .addCase(UpdateModelById.rejected, (state, action) => {
        state.CreateHasError = true;
        state.createModelIsLoading = false;
        state.errorMessage = action.error.message ?? 'something when wrong';
      })
      .addCase(UpdateModelById.fulfilled, (state, {payload}) => {
        state.createModelIsLoading = false;
        if (state.entities) {
          state.entities = state.entities.flatMap((entity) => (entity.id === payload.id ? payload : entity));
        }
      })
      .addCase(deleteModelById.pending, (state) => {
        state.deleteModelIsLoading = true;
        state.deleteHasError = false;
        state.errorMessage = '';
      })
      .addCase(deleteModelById.rejected, (state, action) => {
        state.deleteHasError = true;
        state.deleteModelIsLoading = false;
        state.errorMessage = action.error.message ?? 'something when wrong';
      })
      .addCase(deleteModelById.fulfilled, (state) => {
        state.deleteModelIsLoading = false;
      });
  },
});

export const getAllModels = createAsyncThunk('/models/getAllModels', async () => {
  const {data} = await getAllModelsApi();
  return data;
});

export const getOllamaModels = createAsyncThunk('/models/getOllamaModels', async () => {
  const {data} = await getOllamaModelsApi();

  return data;
});

export const createNewModel = createAsyncThunk(
  '/models/createNewModel',
  async (payload: TOllamaModel, {rejectWithValue}) => {
    try {
      const {data, status} = await CreateNewModelApi(payload);
      if (status === 201) {
        toast.success(`The New Model has been added.`);
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

export const UpdateModelById = createAsyncThunk(
  '/models/UpdateModelById',
  async (payload: Pick<IModel, 'id' | 'name'>, {rejectWithValue}) => {
    try {
      const {data, status} = await UpdateModelByIdApi(payload);
      if (status === 200) {
        toast.success(`the Model is successfully updated`);
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
export const deleteModelById = createAsyncThunk(
  '/documents/deleteModelById',
  async (payload: string, {rejectWithValue, dispatch}) => {
    try {
      const {status} = await deleteModelByIdApi(payload);
      if (status === 204) {
        toast.success(`the model has successfully been removed.`);
        dispatch(getAllModels());
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
export const {setUploadIsLoading, setUploadSucceeded, handleChangeSelectedModel, handleChangeOpenRemoveModelDialog} =
  modelsSlice.actions;

export default modelsSlice.reducer;
