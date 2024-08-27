import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {isAxiosError} from 'axios';
import toast from 'react-hot-toast';

import {
  createNewNextCloudDocumentsApi,
  deleteDocumentByIdApi,
  getAllNextCloudDocumentsApi,
  updateDocumentByIdApi,
} from '@/services/settings.service';
import {IDocument, TNextCluodDoc} from '@/types';

type DocumentStates = {
  entities: TNextCluodDoc[] | null;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | undefined;
};

// Define the initial state using that type
const initialState: DocumentStates = {
  entities: null,
  isLoading: false,
  hasError: false,
  errorMessage: '',
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllNextCloudDocuments.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = '';
      })
      .addCase(getAllNextCloudDocuments.rejected, (state, action) => {
        state.hasError = true;
        state.isLoading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(getAllNextCloudDocuments.fulfilled, (state, action) => {
        console.log('getAllNextCloudDocuments fulfilled');
        state.isLoading = false;

        state.entities = action.payload;
      });
    // .addCase(updateDocument.fulfilled, (state, {payload}) => {
    //   console.log('updateDocument fulfilled');
    //   state.isLoading = false;
    //   if (state.entities) {
    //     state.entities = [...state.entities].flatMap((document) =>
    //       document.id === payload.id ? payload : document,
    //     );
    //   }
    // })
    // .addCase(deleteDocumentById.fulfilled, (state, {payload}) => {
    //   console.log('deleteDocumentById fulfilled');
    //   state.isLoading = false;
    //   if (state.entities) {
    //     // state.entities = [...state.entities].filter((document) => document.id !== payload);
    //   }
    // })
    // .addCase(createNewDocument.fulfilled, (state, {payload}) => {
    //   console.log('createNewDocument fulfilled');
    //   state.isLoading = false;
    //   // if (state.entities) {
    //   //   state.entities = [...state.entities, payload];
    //   // } else {
    //   //   // state.entities = [payload];
    //   // }
    // });
  },
});

// export const getAllDocuments = createAsyncThunk('/documents/getAllDocuments', async () => {
//   // try {
//   console.log('dispatch getAllDocuments runs');
//   const {data} = await getAllDocumentsApi();
//   return data;
// });
export const getAllNextCloudDocuments = createAsyncThunk('/documents/getAllNextCloudDocuments', async () => {
  // try {
  const {data} = await getAllNextCloudDocumentsApi();
  return data;
});

export const updateDocument = createAsyncThunk(
  '/documents/updateDocument',
  async (payload: Pick<IDocument, 'file_name' | 'id'>, {rejectWithValue}) => {
    const {id, file_name} = payload;
    try {
      const {status, data} = await updateDocumentByIdApi(id, {file_name});
      if (status === 200) toast.success(`update Successful.`);

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

export const createNewDocument = createAsyncThunk(
  '/documents/createNewDocument',
  async (document: FormData, {rejectWithValue, dispatch}) => {
    try {
      const {data, status} = await createNewNextCloudDocumentsApi(document);
      if (status === 201) {
        toast.success(`The Docment has been added.`);
        dispatch(getAllNextCloudDocuments());
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

export const deleteDocumentById = createAsyncThunk(
  '/documents/deleteDocumentById',
  async (payload: string, {rejectWithValue}) => {
    try {
      const {status} = await deleteDocumentByIdApi(payload);
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

export default documentsSlice.reducer;
