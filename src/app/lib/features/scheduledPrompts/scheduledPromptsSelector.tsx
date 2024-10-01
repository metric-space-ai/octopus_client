import {RootState} from '../../store';

// Other code such as selectors can use the imported `RootState` type
export const selectScheduledPrompts = (state: RootState) => state.scheduledPrompts;
