/**
 * 장비 관리 관련 상태
 */

import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import type {Device} from '../../types/index';
import {deviceService} from '../../services/deviceService';
import {ApiException} from '../../exceptions/ApiException';

interface DeviceState {
    allDevices: Device[];
    isLoading: boolean;
    error: string | null;
}

const initialState: DeviceState = {
    allDevices: [],
    isLoading: false,
    error: null,
};

export const fetchAllDevicesAsync = createAsyncThunk(
    'device/fetchAllDevices',
    async (_, { rejectWithValue }) => {
        try {
            const response = await deviceService.getAllDevices();
            return response;
        } catch (error) {
            if (ApiException.isApiException(error)) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('전체 디바이스 목록을 불러오는데 실패했습니다.');
        }
    }
);

const deviceSlice = createSlice({
    name: 'device',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all devices
            .addCase(fetchAllDevicesAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllDevicesAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allDevices = action.payload.data;
            })
            .addCase(fetchAllDevicesAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = deviceSlice.actions;
export default deviceSlice.reducer;
