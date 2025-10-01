import api from '../libs/api.ts';
import type {LogEntry, LogRequest, PaginationParams, ApiResponse} from '../types/index';

export const logService = {
    getLogs: async (params: PaginationParams): Promise<ApiResponse<{
        logs: LogEntry[];
        currentPageNo: number;
        sizePerPage: number;
        totalCnt: number;
        pageCnt: number;
        prev: boolean;
        next: boolean;
    }>> => {
        return api.get('/devices/usage', {params});
    },

    getLogsForDevice: async (deviceId: number): Promise<ApiResponse<LogEntry>> => {
        return api.get(`/devices/usage/device/${deviceId}`);
    },

    getLog: async (usageId: number): Promise<ApiResponse<LogEntry>> => {
        return api.get(`/devices/usage/${usageId}`);
    },

    createLog: async (logData: LogRequest): Promise<ApiResponse<LogEntry>> => {
        return api.post('/devices/usage', logData);
    },

    updateLog: async (usageId: number, logData: LogRequest): Promise<ApiResponse<LogEntry>> => {
        return api.post(`/devices/usage/${usageId}`, logData);
    },

    deleteLog: async (usageId: number): Promise<ApiResponse<void>> => {
        return api.delete(`/devices/usage/${usageId}`);
    },
};
