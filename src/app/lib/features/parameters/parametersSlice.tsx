import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {isAxiosError} from 'axios';
import toast from 'react-hot-toast';

import {
  createNewParameterApi,
  deleteParameterByIdApi,
  getParameterByIdApi,
  getParametersApi,
  updateParameterByIdApi,
} from '@/services/settings.service';
import {IParameter} from '@/types';

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
      .addCase(getAllParameters.pending, (state) => {
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
      .addCase(deleteParameterById.fulfilled, (state) => {
        console.log('deleteParameterById fulfilled');
        state.isLoading = false;
        if (state.entities) {
          // state.entities = [...state.entities].filter((parameter) => parameter.id !== payload);
        }
      })
      .addCase(createNewParameter.fulfilled, (state) => {
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
  const {data} = await getParametersApi();
  return data;
});

export const getParameter = createAsyncThunk('/parameters/getParameter', async (payload: string) => {
  const {data} = await getParameterByIdApi(payload);
  return data;
});

export const updateParameter = createAsyncThunk(
  '/parameters/updateParameter',
  async (payload: {parameter_id: string; name: string; value: string}, {rejectWithValue}) => {
    const {parameter_id, name, value} = payload;
    try {
      const {status, data} = await updateParameterByIdApi(parameter_id, {name, value});
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

export default parametersSlice.reducer;
