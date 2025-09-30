import api from '../libs/api.ts';
import type {ApiResponse, LoginRequest, LoginResponse, SignupRequest, SignupResponse} from '../types/index';

export const authService = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return api.post('/auth/login', credentials);
  },

  signup: async (userData: SignupRequest): Promise<ApiResponse<SignupResponse>> => {
    return api.post('/auth/signup', userData);
  },

  refreshToken: async (refreshToken: string): Promise<ApiResponse<{ accessToken: string }>> => {
    return api.post('/auth/refresh', { refreshToken });
  },

  logout: (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};
