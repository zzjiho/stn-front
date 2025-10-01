import api from '../libs/api.ts';
import type {
    ApiResponse,
    LogResponse,
    LogListResponse,
    LogRequest,
    PaginationParams
} from '../types/index';

export const logService = {
    getLogs: async (params: PaginationParams): Promise<ApiResponse<LogListResponse>> => {
        return api.get('/devices/usage', {params});
    },

    createLog: async (logData: LogRequest): Promise<ApiResponse<LogResponse>> => {
        return api.post('/devices/usage', logData);
    },

    updateLog: async (usageId: number, logData: LogRequest): Promise<ApiResponse<LogResponse>> => {
        return api.post(`/devices/usage/${usageId}`, logData);
    },

    deleteLog: async (usageId: number): Promise<ApiResponse<void>> => {
        return api.delete(`/devices/usage/${usageId}`);
    },
};
