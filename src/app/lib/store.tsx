import {configureStore} from '@reduxjs/toolkit';

import aiServicesSlice from './features/aiServices/aiServicesSlice';
import documentsSlice from './features/documents/documentsSlice';
import filesSlice from './features/files/filesSlice';
import modelsSlice from './features/ollamaModels/modelsSlice';
import parametersSlice from './features/parameters/parametersSlice';
import simpleAppsSlice from './features/simpleApps/simpleAppsSlice';
import teamMembersSlice from './features/teamMembers/teamMemberSlice';
import tokensSlice from './features/tokens/tokensSlice';
import waspAppsSlice from './features/waspApps/waspAppsSlice';

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
      files: filesSlice,
      tokens: tokensSlice,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
