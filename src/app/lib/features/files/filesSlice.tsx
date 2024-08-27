import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {isAxiosError} from 'axios';
import toast from 'react-hot-toast';

import {CreateNewFileApi, UpdateFileByIdApi, deleteFileByIdApi, getAllFilesApi} from '@/services/settings.service';
import {IFile} from '@/types';

interface IFilesStates {
  entities: IFile[] | null;
  app_src: string;
  isLoading: boolean;
  CreateHasError: boolean;
  deleteFileIsLoading: boolean;
  createFileIsLoading: boolean;
  deleteHasError: boolean;
  reloadFilesIsAvailable: boolean;
  hasError: boolean;
  errorMessage: string | undefined;
  uploadIsLoading: boolean;
  uploadSucceeded: boolean;
  selectedFile: IFile | null;
  openRemoveFileDialog: boolean;
}
// Define the initial state using that type
const initialState: IFilesStates = {
  entities: null,
  app_src: '',
  isLoading: false,
  CreateHasError: false,
  deleteFileIsLoading: false,
  createFileIsLoading: false,
  deleteHasError: false,
  hasError: false,
  reloadFilesIsAvailable: false,
  errorMessage: '',
  uploadIsLoading: false,
  uploadSucceeded: false,
  selectedFile: null,
  openRemoveFileDialog: false,
};

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setUploadIsLoading: (state, action: PayloadAction<boolean>) => {
      state.uploadIsLoading = action.payload;
    },
    setUploadSucceeded: (state, action: PayloadAction<boolean>) => {
      state.uploadSucceeded = action.payload;
    },
    handleChangeSelectedFile: (state, {payload}: PayloadAction<IFile | null>) => {
      state.selectedFile = payload;
    },
    handleChangeOpenRemoveFileDialog: (state, {payload}: PayloadAction<boolean>) => {
      state.openRemoveFileDialog = payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllFiles.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = '';
      })
      .addCase(getAllFiles.rejected, (state, action) => {
        state.hasError = true;
        state.isLoading = false;
        state.reloadFilesIsAvailable = true;
        state.errorMessage = action.error.message;
      })
      .addCase(getAllFiles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reloadFilesIsAvailable = false;
        state.entities = action.payload;
      })
      .addCase(createNewFile.pending, (state) => {
        state.createFileIsLoading = true;
        state.CreateHasError = false;
        state.errorMessage = '';
      })
      .addCase(createNewFile.rejected, (state, action) => {
        state.CreateHasError = true;
        state.createFileIsLoading = false;
        state.errorMessage = action.error.message ?? 'something when wrong';
      })
      .addCase(createNewFile.fulfilled, (state, action) => {
        state.createFileIsLoading = false;
        if (state.entities) {
          state.entities = [...state.entities, action.payload];
        } else {
          state.entities = [action.payload];
        }
      })
      .addCase(UpdateFileById.pending, (state) => {
        state.createFileIsLoading = true;
        state.CreateHasError = false;
        state.errorMessage = '';
      })
      .addCase(UpdateFileById.rejected, (state, action) => {
        state.CreateHasError = true;
        state.createFileIsLoading = false;
        state.errorMessage = action.error.message ?? 'something when wrong';
      })
      .addCase(UpdateFileById.fulfilled, (state, {payload}) => {
        state.createFileIsLoading = false;
        if (state.entities) {
          state.entities = state.entities.flatMap((entity) => (entity.id === payload.id ? payload : entity));
        }
      })
      .addCase(deleteFileById.pending, (state) => {
        state.deleteFileIsLoading = true;
        state.deleteHasError = false;
        state.errorMessage = '';
      })
      .addCase(deleteFileById.rejected, (state, action) => {
        state.deleteHasError = true;
        state.deleteFileIsLoading = false;
        state.errorMessage = action.error.message ?? 'something when wrong';
      })
      .addCase(deleteFileById.fulfilled, (state) => {
        state.deleteFileIsLoading = false;
      });
  },
});

export const getAllFiles = createAsyncThunk('/files/getAllFiles', async () => {
  const {data} = await getAllFilesApi();
  // const result: IFile[] = [...new Map(data.map((file) => [file.id, file])).values()];
  const uniqueArray = data.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));

  return uniqueArray;
});

export const createNewFile = createAsyncThunk('/files/createNewFile', async (payload: FormData, {rejectWithValue}) => {
  try {
    const {data, status} = await CreateNewFileApi(payload);
    if (status === 201) {
      toast.success(`The New File has been added.`);
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
});

export const UpdateFileById = createAsyncThunk(
  '/files/UpdateFileById',
  async (payload: {id: string; file: FormData}, {rejectWithValue}) => {
    try {
      const {data, status} = await UpdateFileByIdApi(payload);
      if (status === 200) {
        toast.success(`the File is successfully updated`);
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
export const deleteFileById = createAsyncThunk(
  '/documents/deleteFileById',
  async (payload: string, {rejectWithValue, dispatch}) => {
    try {
      const {status} = await deleteFileByIdApi(payload);
      if (status === 204) {
        toast.success(`the File has successfully been removed.`);
        dispatch(getAllFiles());
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
export const {setUploadIsLoading, setUploadSucceeded, handleChangeSelectedFile, handleChangeOpenRemoveFileDialog} =
  filesSlice.actions;

export default filesSlice.reducer;
