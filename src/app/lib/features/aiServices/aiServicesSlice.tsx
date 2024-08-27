import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {isAxiosError} from 'axios';
import toast from 'react-hot-toast';

import {
  changePluginActivitiesByPluginIdApi,
  deletePluginByIdApi,
  deletetAiFunctionsByIdApi,
  getAiFunctionsByServiceIdApi,
  getAllPluginsApi,
  getServiceLogsByPluginIdApi,
  putAllowedUsersForAiAccessApi,
  updatetAiFunctionsByIdApi,
} from '@/services/settings.service';
import {IAIFunctions, IPlugin, IPluginActivation} from '@/types';

interface AiServicesStates {
  entities: IPlugin[] | undefined;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | undefined;
  reloadPluginIsAvailable: boolean;
  functionIsLoading: boolean;
  deleteFunctionsIsLoading: boolean;
  updateAiFunctionIsLoading: boolean;
  selectedPlugin: IPlugin | null;
  openPluginLogsModal: boolean;
  openRemovePluginDialog: boolean;
  pluginLogIsLoading: boolean;
}
// Define the initial state using that type
const initialState: AiServicesStates = {
  entities: undefined,
  isLoading: false,
  hasError: false,
  errorMessage: '',
  reloadPluginIsAvailable: false,
  functionIsLoading: false,
  deleteFunctionsIsLoading: false,
  updateAiFunctionIsLoading: false,
  selectedPlugin: null,
  openPluginLogsModal: false,
  openRemovePluginDialog: false,
  pluginLogIsLoading: false,
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
        // state.entities = [...state.entities].flatMap((plugin) =>
        //   plugin.id === payload.service_id ? {...plugin, ai_functions: payload.service_functions ?? null} : plugin,
        // );
        const plugins = [...state.entities].flatMap((plugin) =>
          plugin.id === payload.service_id ? {...plugin, ai_functions: payload.service_functions ?? null} : plugin,
        );
        state.entities = plugins;
        const selectedPlugin = plugins.find((plugin) => plugin.id === payload.service_id);
        console.log({plugins, selectedPlugin, entities: state.entities, payload});
        if (selectedPlugin) state.selectedPlugin = selectedPlugin;
      }
    },
    handleChangeSelectedPlugin: (state, {payload}: PayloadAction<IPlugin | null>) => {
      state.selectedPlugin = payload;
    },
    handleChangeOpenPluginLogsDialog: (state, {payload}: PayloadAction<boolean>) => {
      state.openPluginLogsModal = payload;
    },
    handleChangeOpenRemovePluginDialog: (state, {payload}: PayloadAction<boolean>) => {
      state.openRemovePluginDialog = payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllPlugins.pending, (state) => {
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
        state.isLoading = false;
        state.entities = action.payload;
      })
      .addCase(changePluginActivitiesByPluginId.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        if (state.entities) {
          state.entities = [...state.entities].flatMap((plugin) =>
            plugin.id === payload?.plugin_id ? {...plugin, is_enabled: payload.is_enabled} : plugin,
          );
        }
      })
      .addCase(getServiceLogsByPluginId.pending, (state) => {
        state.pluginLogIsLoading = true;
        state.hasError = false;
        state.errorMessage = '';
      })
      .addCase(getServiceLogsByPluginId.rejected, (state, action) => {
        state.hasError = true;
        state.pluginLogIsLoading = false;
        state.errorMessage = action.error.message;
      })
      .addCase(getServiceLogsByPluginId.fulfilled, (state, {payload}) => {
        state.pluginLogIsLoading = false;
        if (state.entities && payload) {
          // state.entities = [...state.entities].flatMap((plugin) =>
          //   plugin.id === payload.id ? {...plugin, ...payload} : plugin,
          // );
          // state.entities = [...state.entities].flatMap((plugin) => (plugin.id === payload.id ? payload : plugin));
        }
      })
      .addCase(putAllowedUsersForAiAccess.fulfilled, (state, {payload}) => {
        state.isLoading = false;
        if (state.entities && payload) {
          state.entities = [...state.entities].flatMap((plugin) => (plugin.id === payload.id ? {...payload} : plugin));
        }
      })
      .addCase(deletePluginById.fulfilled, (state) => {
        state.isLoading = false;
      })

      .addCase(updatetAiFunctionsById.pending, (state) => {
        state.updateAiFunctionIsLoading = true;
      })
      .addCase(updatetAiFunctionsById.rejected, (state) => {
        state.updateAiFunctionIsLoading = false;
      })
      .addCase(updatetAiFunctionsById.fulfilled, (state, {payload}) => {
        state.updateAiFunctionIsLoading = false;
        if (state.entities && payload) {
          state.entities = [...state.entities].map((plugin) =>
            plugin.id === payload.ai_service_id && plugin.ai_functions && plugin.ai_functions.length > 0
              ? {
                  ...plugin,
                  ai_functions: plugin.ai_functions.flatMap((ai_func) =>
                    ai_func.id === payload.id ? {...payload} : ai_func,
                  ),
                }
              : plugin,
          );
        }
      })
      .addCase(deletetAiFunctionsById.pending, (state) => {
        state.deleteFunctionsIsLoading = true;
      })
      .addCase(deletetAiFunctionsById.rejected, (state) => {
        state.deleteFunctionsIsLoading = false;
      })
      .addCase(deletetAiFunctionsById.fulfilled, (state, {payload}) => {
        state.deleteFunctionsIsLoading = false;
        if (state.entities && payload) {
          state.entities = [...state.entities].map((plugin) =>
            plugin.id === payload.ai_service_id && plugin.ai_functions && plugin.ai_functions.length > 0
              ? {
                  ...plugin,
                  ai_functions: plugin.ai_functions.filter((ai_func) => ai_func.id !== payload.id),
                }
              : plugin,
          );
        }
      });
  },
});

export const getAllPlugins = createAsyncThunk('/aiServices/getAllPlugins', async () => {
  // try {

  const {data} = await getAllPluginsApi();
  return data;
  // if (status === 200) {
  // handleGetPluginFunctions(data);
  // }
});

export const getServiceLogsByPluginId = createAsyncThunk(
  '/aiServices/getServiceLogsByPluginId',
  async (id: string, {rejectWithValue}) => {
    try {
      const {status, data: logs} = await getServiceLogsByPluginIdApi(id);
      if (status === 200) {
        // dispatch(handleChangeSelectedPlugin({...plugin, logs}));
        return logs;
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

type TUpdatePluginInputs = {
  plugin_id: string;
  payload: IPluginActivation;
};

export const changePluginActivitiesByPluginId = createAsyncThunk(
  '/aiServices/changePluginActivitiesByPluginId',
  async ({plugin_id, payload}: TUpdatePluginInputs, {rejectWithValue}) => {
    try {
      const {status} = await changePluginActivitiesByPluginIdApi(plugin_id, payload);
      if (status === 201) {
        toast.success('updated successfully');
        return {plugin_id, ...payload};
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

// export const updatePluginById = createAsyncThunk(
//   '/aiServices/updatePluginById',
//   async ({id, formData}: {id: string; formData: FormData}, {rejectWithValue}) => {
//     try {
//       const {status, data} = await updatePluginByIdApi(id, formData);
//       if (status === 200) {
//         toast.success('updated successfully');
//       }
//       return data;
//     } catch (error:any) {
//

//       if (error instanceof AxiosError) {
//         toast.error(error?.response?.data.error);
//       }
//       if (!error.response) {
//         throw error;
//       }
//       return rejectWithValue(error?.response?.data);
//     }
//   },
// );

export const deletePluginById = createAsyncThunk(
  '/aiServices/deletePluginById',
  async (payload: IPlugin, {rejectWithValue, dispatch}) => {
    try {
      const {status} = await deletePluginByIdApi(payload.id);
      if (status === 204) {
        toast.success(`the plugin has successfully been removed.`);
        dispatch(getAllPlugins());
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

export const updatetAiFunctionsById = createAsyncThunk(
  '/aiServices/updatetAiFunctionsById',
  async (payload: IAIFunctions, {rejectWithValue}) => {
    try {
      const {status, data} = await updatetAiFunctionsByIdApi(payload.ai_service_id, payload.id, {
        is_enabled: payload.is_enabled,
      });

      if (status === 200) {
        toast.success('updated successfully');
        if (data) {
          return data;
        } else {
          return payload;
        }
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

export const getAiFunctionsByPluginId = createAsyncThunk(
  '/aiServices/getAiFunctionsByPluginId',
  async (service_id: string, {rejectWithValue, dispatch}) => {
    try {
      const {status, data: service_functions} = await getAiFunctionsByServiceIdApi(service_id);
      if (status === 200) {
        dispatch(mergeFunctionToPluginById({service_functions, service_id}));
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
  mergeFunctionToPluginById,
  handleChangeSelectedPlugin,
  handleChangeOpenPluginLogsDialog,
  handleChangeOpenRemovePluginDialog,
} = aiServicesSlice.actions;

export default aiServicesSlice.reducer;
