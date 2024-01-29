import {AxiosError} from 'axios';
import toast from 'react-hot-toast';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import {IParameter} from '@/types';
import {
  createNewParameterApi,
  deleteParameterByIdApi,
  getParameterByIdApi,
  getParametersApi,
  updateParameterByIdApi,
} from '@/services/settings.service';

type ParametersStates = {
  entities: IParameter[] | null;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | undefined;
};

// Define the initial state using that type
const initialState: ParametersStates = {
  entities: null,
  isLoading: false,
  hasError: false,
  errorMessage: '',
};

const parametersSlice = createSlice({
  name: 'parameters',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllParameters.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = '';
      })
      .addCase(getAllParameters.rejected, (state, action) => {
        state.hasError = true;
        state.isLoading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(getAllParameters.fulfilled, (state, action) => {
        console.log('getAllParameters fulfilled');
        state.isLoading = false;

        state.entities = action.payload;
      })
      .addCase(updateParameter.fulfilled, (state, {payload}) => {
        console.log('updateParameter fulfilled');
        state.isLoading = false;
        if (state.entities) {
          state.entities = [...state.entities].flatMap((parameter) =>
            parameter.id === payload.id ? payload : parameter,
          );
        }
      })
      .addCase(deleteParameterById.fulfilled, (state, {payload}) => {
        console.log('deleteParameterById fulfilled');
        state.isLoading = false;
        if (state.entities) {
          // state.entities = [...state.entities].filter((parameter) => parameter.id !== payload);
        }
      })
      .addCase(createNewParameter.fulfilled, (state, {payload}) => {
        console.log('createNewParameter fulfilled');
        state.isLoading = false;
        if (state.entities) {
          // state.entities = [...state.entities, payload];
        } else {
          // state.entities = [payload];
        }
      });
  },
});

export const getAllParameters = createAsyncThunk('/parameters/getAllParameters', async () => {
  // try {
  console.log('dispatch getAllParameters runs');
  const {data} = await getParametersApi();
  return data;
});

export const getParameter = createAsyncThunk('/parameters/getParameter', async (payload: string) => {
  // try {
  console.log('dispatch getParameter runs');
  const {data} = await getParameterByIdApi(payload);
  return data;
});

interface ValidationErrors {
  errorMessage: string;
  field_errors: Record<string, string>;
}

export const updateParameter = createAsyncThunk(
  '/parameters/updateParameter',
  async (payload: {parameter_id: string; name: string; value: string}, {rejectWithValue}) => {
    const {parameter_id, name, value} = payload;
    try {
      const {status, data} = await updateParameterByIdApi(parameter_id, {name, value});
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

export const createNewParameter = createAsyncThunk(
  '/parameters/createNewParameter',
  async (parameter: {name: string; value: string}, {rejectWithValue, dispatch}) => {
    try {
      const {data, status} = await createNewParameterApi(parameter);
      if (status === 201) {
        toast.success(`The new user has been added.`);
        dispatch(getAllParameters());
      }

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

export const deleteParameterById = createAsyncThunk(
  '/parameters/deleteParameterById',
  async (payload: string, {rejectWithValue, dispatch}) => {
    try {
      const {status} = await deleteParameterByIdApi(payload);
      if (status === 204) {
        toast.success(`user has successfully been removed.`);
        dispatch(getAllParameters());
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

export default parametersSlice.reducer;
