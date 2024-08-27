import {RootState} from '../../store';

// Other code such as selectors can use the imported `RootState` type
export const selectWaspApps = (state: RootState) => state.waspApps;
