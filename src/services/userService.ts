import api from '../libs/api.ts';
import type {
    UserListResponse,
    UserDetailResponse,
    UserStatusRequest,
    UserStatusResponse,
    PaginationParams,
    ApiResponse
} from '../types/index';

export const userService = {
    getUsers: async (params: PaginationParams): Promise<ApiResponse<UserListResponse>> => {
        return api.get('/users', {params});
    },

    getUserById: async (userId: number): Promise<ApiResponse<UserDetailResponse>> => {
        return api.get(`/users/${userId}`);
    },

    updateUserStatus: async (userId: number, statusData: UserStatusRequest): Promise<ApiResponse<UserStatusResponse>> => {
        return api.post(`/users/${userId}/status`, statusData);
    }
};
