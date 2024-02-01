import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import {
  createTeamMemberApi,
  deletePluginByIdApi,
  deletetAiFunctionsByIdApi,
  getAiFunctionsByServiceIdApi,
  getAllPluginsApi,
  putAllowedUsersForAiAccessApi,
  updatePluginByIdApi,
  updatetAiFunctionsByIdApi,
} from '@/services/settings.service';
import {IAIFunctions, ICreateUser, IPlugin, IPluginActivation, ValidationErrors} from '@/types';

import {AxiosError} from 'axios';
import toast from 'react-hot-toast';

interface AiServicesStates {
  entities: IPlugin[] | undefined;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | undefined;
  reloadPluginIsAvailable: boolean;
}
// Define the initial state using that type
const initialState: AiServicesStates = {
  entities: undefined,
  isLoading: false,
  hasError: false,
  errorMessage: '',
  reloadPluginIsAvailable: false,
};

const aiServicesSlice = createSlice({
  name: 'aiServices',
  initialState,
  reducers: {
    mergeFunctionToPluginById: (
      state,
      {payload}: PayloadAction<{service_functions: IAIFunctions[]; service_id: string}>,
    ) => {
      if (state.entities) {
        state.entities = [...state.entities].flatMap((plugin) =>
          plugin.id === payload.service_id ? {...plugin, ai_functions: payload.service_functions ?? null} : plugin,
        );
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllPlugins.pending, (state, action) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = '';
        state.reloadPluginIsAvailable = false;
      })
      .addCase(getAllPlugins.rejected, (state, action) => {
        state.hasError = true;
        state.isLoading = false;
        state.errorMessage = action.error.message;
        state.reloadPluginIsAvailable = true;
      })
      .addCase(getAllPlugins.fulfilled, (state, action) => {
        console.log('getAllPlugins fulfilled');
        state.isLoading = false;
        state.entities = action.payload;
      })
      .addCase(updatePluginById.fulfilled, (state, {payload}) => {
        console.log('updatePluginById fulfilled');
        state.isLoading = false;
        if (state.entities) {
          state.entities = [...state.entities].flatMap((plugin) =>
            plugin.id === payload?.plugin_id ? {...plugin, is_enabled: payload.is_enabled} : plugin,
          );
        }
      })
      .addCase(putAllowedUsersForAiAccess.fulfilled, (state, {payload}) => {
        console.log('putAllowedUsersForAiAccess fulfilled');
        state.isLoading = false;
        if (state.entities && payload) {
          state.entities = [...state.entities].flatMap((plugin) => (plugin.id === payload.id ? {...payload} : plugin));
        }
      })
      .addCase(deletePluginById.fulfilled, (state, {payload}) => {
        console.log('deletePluginById fulfilled');
        state.isLoading = false;
        if (state.entities) {
          // state.entities = [...state.entities].filter((plugin) => plugin.id !== payload.id);
        }
      })
      .addCase(updatetAiFunctionsById.fulfilled, (state, {payload}) => {
        console.log('updatetAiFunctionsById fulfilled');
        state.isLoading = false;
        if (state.entities) {
          // state.entities = [...state.entities].filter((plugin) => plugin.id !== payload.id);
        }
      })
      .addCase(deletetAiFunctionsById.fulfilled, (state, {payload}) => {
        console.log('deletetAiFunctionsById fulfilled');
        state.isLoading = false;
        // if (state.entities) {
        // state.entities = [...state.entities].filter((plugin) => plugin.id !== payload.id);
        // }
      });
  },
});

export const getAllPlugins = createAsyncThunk('/aiServices/getAllPlugins', async () => {
  // try {
  console.log('dispatch getAllPlugins runs');
  const {status, data} = await getAllPluginsApi();
  return data;
  // if (status === 200) {
  // handleGetPluginFunctions(data);
  // }
});

type TAiAllowAccess = {
  plugin_id: string;
  allowedUsers: string[] | [];
};
export const putAllowedUsersForAiAccess = createAsyncThunk(
  '/aiServices/putAllowedUsersForAiAccess',
  async ({plugin_id, allowedUsers}: TAiAllowAccess, {rejectWithValue, dispatch}) => {
    try {
      const {status, data} = await putAllowedUsersForAiAccessApi(plugin_id, allowedUsers);
      if (status === 200) {
        toast.success('updated successfully');
        return data;
      } else {
        dispatch(getAllPlugins());
      }
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

type TUpdatePluginInputs = {
  plugin_id: string;
  payload: IPluginActivation;
};

export const updatePluginById = createAsyncThunk(
  '/aiServices/updatePluginById',
  async ({plugin_id, payload}: TUpdatePluginInputs, {rejectWithValue}) => {
    try {
      const {status} = await updatePluginByIdApi(plugin_id, payload);
      if (status === 201) {
        toast.success('updated successfully');
        return {plugin_id, ...payload};
      }
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

export const deletePluginById = createAsyncThunk(
  '/aiServices/deletePluginById',
  async (payload: IPlugin, {rejectWithValue, dispatch}) => {
    try {
      const {status} = await deletePluginByIdApi(payload.id);
      if (status === 204) {
        toast.success(`the plugin has successfully been removed.`);
        dispatch(getAllPlugins());
      }
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

export const deletetAiFunctionsById = createAsyncThunk(
  '/aiServices/deletetAiFunctionsById',
  async (service_function: IAIFunctions, {rejectWithValue, dispatch}) => {
    try {
      const {status} = await deletetAiFunctionsByIdApi(service_function.ai_service_id, service_function.id);

      if (status === 204) {
        toast.success(`the function has successfully been removed.`);
        dispatch(getAiFunctionsByPluginId(service_function.ai_service_id));
        return service_function;
      }
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

export const updatetAiFunctionsById = createAsyncThunk(
  '/aiServices/updatetAiFunctionsById',
  async (payload: IAIFunctions, {rejectWithValue, dispatch}) => {
    try {
      const {status} = await updatetAiFunctionsByIdApi(payload.ai_service_id, payload.id, {
        is_enabled: payload.is_enabled,
      });

      if (status === 200) {
        toast.success('updated successfully');
      }
      // if (status === 204) {
      //   toast.success(`the function has successfully been removed.`);
      //   dispatch(getAllPlugins());
      // }
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

export const getAiFunctionsByPluginId = createAsyncThunk(
  '/aiServices/getAiFunctionsByPluginId',
  async (service_id: string, {rejectWithValue, dispatch}) => {
    try {
      const {status, data: service_functions} = await getAiFunctionsByServiceIdApi(service_id);
      if (status === 200) {
        dispatch(mergeFunctionToPluginById({service_functions, service_id}));
      }
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

// const handleGetPluginFunctions = async (inputPlugins: IPlugin[]) => {
//   if (inputPlugins) {
//     const result: IPlugin[] | [] = [];
//     for (const plugin of inputPlugins) {
//       const {id, is_enabled, setup_status} = plugin;

//       if (plugin.ai_functions === undefined && setup_status === AI_SERVICES_SETUP_STATUS.Performed) {
//         try {
//           const {status, data} = await getAiFunctionsByServiceIdApi(id);
//           if (status === 200) {
//             const resultPlugin: IPlugin = {...plugin, ai_functions: data.length > 0 ? data : null};
//             result.push(resultPlugin as never);
//           }
//         } catch (err) {
//           if (err instanceof AxiosError) {
//             toast.error(err?.response?.data.error);
//           }
//           result.push({...plugin, ai_functions: null} as never);
//         } finally {
//         }
//       } else {
//         result.push({...plugin, ai_functions: null} as never);
//       }
//     }
//     // setPlugins(result);
//   } else {
//     // // setPlugins(inputPlugins);
//   }
//   // setLoading(false);
// };

const {mergeFunctionToPluginById} = aiServicesSlice.actions;

export default aiServicesSlice.reducer;