import api from '../libs/api.ts';
import type {
    DeviceRequest,
    DeviceResponse,
    DeviceListResponse,
    PaginationParams,
    SortParams,
    ApiResponse,
    Device
} from '../types/index';

export const deviceService = {
    getDevices: async (params: PaginationParams & SortParams): Promise<ApiResponse<DeviceListResponse>> => {
        return api.get('/devices', {params});
    },

    getDevice: async (deviceId: number): Promise<ApiResponse<DeviceResponse>> => {
        return api.get(`/devices/${deviceId}`);
    },

    createDevice: async (deviceData: DeviceRequest): Promise<ApiResponse<DeviceResponse>> => {
        return api.post('/devices', deviceData);
    },

    updateDevice: async (deviceId: number, deviceData: DeviceRequest): Promise<ApiResponse<DeviceResponse>> => {
        return api.post(`/devices/${deviceId}`, deviceData);
    },

    deleteDevice: async (deviceId: number): Promise<ApiResponse<void>> => {
        return api.delete(`/devices/${deviceId}`);
    },

    getAllDevices: async (): Promise<ApiResponse<Device[]>> => {
        return api.get('/devices/all');
    }
};
