import {configureStore} from '@reduxjs/toolkit';
import teamMembersSlice from './features/teamMembers/teamMemberSlice';
import aiServicesSlice from './features/aiServices/aiServicesSlice';
import parametersSlice from './features/parameters/parametersSlice';
import simpleAppsSlice from './features/simpleApps/simpleAppsSlice';
import waspAppsSlice from './features/waspApps/waspAppsSlice';
import documentsSlice from './features/documents/documentsSlice';
import modelsSlice from './features/ollamaModels/modelsSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      teamMembers: teamMembersSlice,
      aiServices: aiServicesSlice,
      parameters: parametersSlice,
      simpleApps: simpleAppsSlice,
      waspApps: waspAppsSlice,
      documents: documentsSlice,
      models: modelsSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
