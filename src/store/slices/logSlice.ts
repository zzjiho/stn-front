/**
 * 로그 관리 관련 상태
 */

import type {PayloadAction} from '@reduxjs/toolkit';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import type {LogResponse, LogRequest, PaginationParams} from '../../types/index';
import {logService} from '../../services/logService';
import {ApiException} from '../../exceptions/ApiException';

interface LogState {
    logs: LogResponse[];
    currentPageNo: number;
    sizePerPage: number;
    totalCnt: number;
    pageCnt: number;
    prev: boolean;
    next: boolean;
    isLoading: boolean;
    error: string | null;
    selectedLog: LogResponse | null;
}

const initialState: LogState = {
    logs: [],
    currentPageNo: 1,
    sizePerPage: 10,
    totalCnt: 0,
    pageCnt: 0,
    prev: false,
    next: false,
    isLoading: false,
    error: null,
    selectedLog: null,
};

// Async thunks
export const fetchLogsAsync = createAsyncThunk(
    'log/fetchLogs',
    async (params: PaginationParams, {rejectWithValue}) => {
        try {
            const response = await logService.getLogs(params);
            return response;
        } catch (error) {
            if (ApiException.isApiException(error)) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('로그 목록을 불러오는데 실패했습니다.');
        }
    }
);

export const createLogAsync = createAsyncThunk(
    'log/createLog',
    async (logData: LogRequest, {rejectWithValue}) => {
        try {
            const response = await logService.createLog(logData);
            return response;
        } catch (error) {
            if (ApiException.isApiException(error)) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('로그 생성에 실패했습니다.');
        }
    }
);

export const updateLogAsync = createAsyncThunk(
    'log/updateLog',
    async ({usageId, logData}: { usageId: number; logData: LogRequest }, {rejectWithValue}) => {
        try {
            const response = await logService.updateLog(usageId, logData);
            return response;
        } catch (error) {
            if (ApiException.isApiException(error)) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('로그 수정에 실패했습니다.');
        }
    }
);

export const deleteLogAsync = createAsyncThunk(
    'log/deleteLog',
    async (usageId: number, {rejectWithValue}) => {
        try {
            await logService.deleteLog(usageId);
            return usageId;
        } catch (error) {
            if (ApiException.isApiException(error)) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('로그 삭제에 실패했습니다.');
        }
    }
);

const logSlice = createSlice({
    name: 'log',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setSelectedLog: (state, action: PayloadAction<LogResponse | null>) => {
            state.selectedLog = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch logs
            .addCase(fetchLogsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchLogsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                const {deviceUsages, currentPageNo, sizePerPage, totalCnt, pageCnt, prev, next} = action.payload.data;
                state.logs = deviceUsages;
                state.currentPageNo = currentPageNo;
                state.sizePerPage = sizePerPage;
                state.totalCnt = totalCnt;
                state.pageCnt = pageCnt;
                state.prev = prev;
                state.next = next;
            })
            .addCase(fetchLogsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Create log
            .addCase(createLogAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createLogAsync.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(createLogAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update log
            .addCase(updateLogAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateLogAsync.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(updateLogAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Delete log
            .addCase(deleteLogAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteLogAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.logs = state.logs.filter(log => log.usageId !== action.payload);
            })
            .addCase(deleteLogAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const {clearError, setSelectedLog} = logSlice.actions;
export default logSlice.reducer;
