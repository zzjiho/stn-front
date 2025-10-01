/**
 * 장비 관리 관련 상태
 */

import type {PayloadAction} from '@reduxjs/toolkit';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import type {Device, DeviceRequest, PaginationParams} from '../../types/index';
import {deviceService} from '../../services/deviceService';
import {ApiException} from '../../exceptions/ApiException';

interface DeviceState {
    devices: Device[];
    allDevices: Device[]; // 드롭다운용 전체 장치 목록
    currentPageNo: number;
    sizePerPage: number;
    totalCnt: number;
    pageCnt: number;
    prev: boolean;
    next: boolean;
    isLoading: boolean;
    error: string | null;
    selectedDevice: Device | null;
}

const initialState: DeviceState = {
    devices: [],
    allDevices: [],
    currentPageNo: 1,
    sizePerPage: 10,
    totalCnt: 0,
    pageCnt: 0,
    prev: false,
    next: false,
    isLoading: false,
    error: null,
    selectedDevice: null,
};

// Async thunks
export const fetchDevicesAsync = createAsyncThunk(
    'device/fetchDevices',
    async (params: PaginationParams, {rejectWithValue}) => {
        try {
            const response = await deviceService.getDevices(params);
            return response;
        } catch (error) {
            if (ApiException.isApiException(error)) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('디바이스 목록을 불러오는데 실패했습니다.');
        }
    }
);

export const fetchAllDevicesAsync = createAsyncThunk(
    'device/fetchAllDevices',
    async (_, {rejectWithValue}) => {
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

export const createDeviceAsync = createAsyncThunk(
    'device/createDevice',
    async (deviceData: DeviceRequest, {rejectWithValue}) => {
        try {
            const response = await deviceService.createDevice(deviceData);
            return response;
        } catch (error) {
            if (ApiException.isApiException(error)) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('디바이스 생성에 실패했습니다.');
        }
    }
);

export const updateDeviceAsync = createAsyncThunk(
    'device/updateDevice',
    async ({deviceId, deviceData}: { deviceId: number; deviceData: DeviceRequest }, {rejectWithValue}) => {
        try {
            const response = await deviceService.updateDevice(deviceId, deviceData);
            return response;
        } catch (error) {
            if (ApiException.isApiException(error)) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('디바이스 수정에 실패했습니다.');
        }
    }
);

export const deleteDeviceAsync = createAsyncThunk(
    'device/deleteDevice',
    async (deviceId: number, {rejectWithValue}) => {
        try {
            await deviceService.deleteDevice(deviceId);
            return deviceId;
        } catch (error) {
            if (ApiException.isApiException(error)) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('디바이스 삭제에 실패했습니다.');
        }
    }
);

const deviceSlice = createSlice({
    name: 'device', // slice 이름
    initialState, // 상태 초기값
    reducers: { // 동기적인 상태 변경 로직
        clearError: (state) => {
            state.error = null;
        },
        setSelectedDevice: (state, action: PayloadAction<Device | null>) => {
            state.selectedDevice = action.payload;
        },
        setPagination: (state, action: PayloadAction<{ page: number; size: number }>) => {
            state.currentPageNo = action.payload.page;
            state.sizePerPage = action.payload.size;
        },
    },
    extraReducers: (builder) => { // 비동기적인 상태 변경 로직
        builder
            // Fetch devices
            .addCase(fetchDevicesAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDevicesAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                const {devices, currentPageNo, sizePerPage, totalCnt, pageCnt, prev, next} = action.payload.data;
                state.devices = devices;
                state.currentPageNo = Math.max(1, currentPageNo);
                state.sizePerPage = sizePerPage;
                state.totalCnt = totalCnt;
                state.pageCnt = pageCnt;
                state.prev = prev;
                state.next = next;
            })
            .addCase(fetchDevicesAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Create device
            .addCase(createDeviceAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createDeviceAsync.fulfilled, (state) => {
                state.isLoading = false;
                // 새 디바이스가 생성되면 첫 페이지를 다시 로드해야 함
            })
            .addCase(createDeviceAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update device
            .addCase(updateDeviceAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateDeviceAsync.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(updateDeviceAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Delete device
            .addCase(deleteDeviceAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteDeviceAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.devices = state.devices.filter(device => device.deviceId !== action.payload);
            })
            .addCase(deleteDeviceAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Fetch all devices
            .addCase(fetchAllDevicesAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(fetchAllDevicesAsync.fulfilled, (state, action) => {
                state.allDevices = action.payload.data;
            })
            .addCase(fetchAllDevicesAsync.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const {clearError, setSelectedDevice, setPagination} = deviceSlice.actions;
export default deviceSlice.reducer;