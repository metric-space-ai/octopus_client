import {RootState} from '../../store';

// Other code such as selectors can use the imported `RootState` type
export const selectDocuments = (state: RootState) => state.documents;
