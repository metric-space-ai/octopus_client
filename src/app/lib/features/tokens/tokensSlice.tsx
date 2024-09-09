import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {isAxiosError} from 'axios';
import toast from 'react-hot-toast';

import {getChatTokenAuditsApi, getChatTokenAuditsCompanyReportApi} from '@/services/settings.service';
import {ChatTokenAuditCompanyReport, ChatTokenAuditCompanyReportRequestBody} from '@/types';

interface ITokenAuditsStates {
  reports: ChatTokenAuditCompanyReport | null;
  app_src: string;
  isLoading: boolean;
  reportsIsLoading: boolean;
  CreateHasError: boolean;

  reloadTokenAuditsIsAvailable: boolean;
  reloadTokenAuditsReportIsAvailable: boolean;
  hasError: boolean;
  errorMessage: string | undefined;
}
// Define the initial state using that type
const initialState: ITokenAuditsStates = {
  app_src: '',
  isLoading: false,
  reportsIsLoading: false,
  CreateHasError: false,
  reports: null,
  hasError: false,
  reloadTokenAuditsIsAvailable: false,
  reloadTokenAuditsReportIsAvailable: false,
  errorMessage: '',
};

const tokensAuditSlice = createSlice({
  name: 'tokensAudit',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getAllTokenAudits.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = '';
        state.reloadTokenAuditsIsAvailable = false;
      })
      .addCase(getAllTokenAudits.rejected, (state, action) => {
        state.hasError = true;
        state.isLoading = false;
        state.reloadTokenAuditsIsAvailable = true;
        state.errorMessage = action.error.message;
      })
      .addCase(getAllTokenAudits.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(getChatTokenAuditsCompanyReport.pending, (state) => {
        state.reportsIsLoading = true;
        state.hasError = false;
        state.errorMessage = '';
      })
      .addCase(getChatTokenAuditsCompanyReport.rejected, (state, action) => {
        state.hasError = true;
        state.reportsIsLoading = false;
        state.reloadTokenAuditsReportIsAvailable = true;
        state.errorMessage = action.error.message;
      })
      .addCase(getChatTokenAuditsCompanyReport.fulfilled, (state, action) => {
        state.reportsIsLoading = false;
        state.reloadTokenAuditsReportIsAvailable = false;
        if (action.payload) state.reports = action.payload;
      });
  },
});

export const getAllTokenAudits = createAsyncThunk('/tokensAudit/getAllTokenAudits', async () => {
  try {
    const {data} = await getChatTokenAuditsApi();
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      toast.error(error.response?.data.error || 'An error occurred to get report');
    }

    // Handle non-Axios errors
    toast.error('An unexpected error occurred');
  }
});
export const getChatTokenAuditsCompanyReport = createAsyncThunk(
  '/tokensAudit/getChatTokenAuditsCompanyReport',
  async (payload: ChatTokenAuditCompanyReportRequestBody) => {
    try {
      const {data} = await getChatTokenAuditsCompanyReportApi(payload);
      return data;
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(error.response?.data.error || 'An error occurred to get reports');
      }

      // Handle non-Axios errors
      toast.error('An unexpected error occurred');
    }
  },
);

// export const createNewTokenAudit = createAsyncThunk(
//   '/tokensAudit/createNewTokenAudit',
//   async (payload: FormData, {rejectWithValue}) => {
//     try {
//       const {data, status} = await CreateNewTokenAuditApi(payload);
//       if (status === 201) {
//         toast.success(`The New TokenAudit has been added.`);
//       }

//       return data;
//     } catch (error) {
//       if (isAxiosError(error)) {
//         toast.error(error.response?.data.error || 'An error occurred');
//         return rejectWithValue(error.response?.data || 'An error occurred');
//       }

//       // Handle non-Axios errors
//       toast.error('An unexpected error occurred');
//       return rejectWithValue('An unexpected error occurred');
//     }
//   },
// );

export default tokensAuditSlice.reducer;
