import api from '../libs/api.ts';
import type {ApiResponse, LoginRequest, LoginResponse, RefreshResponse, SignupRequest, SignupResponse} from '../types/index';

export const authService = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return api.post('/auth/login', credentials);
  },

  signup: async (userData: SignupRequest): Promise<ApiResponse<SignupResponse>> => {
    return api.post('/auth/signup', userData);
  },

  logout: async (): Promise<ApiResponse<void>> => {
    return api.post('/auth/logout', {});
  },

  // 쿠키 기반 인증 확인
  checkAuth: async (): Promise<ApiResponse<RefreshResponse>> => {
    return api.post('/auth/refresh', {});
  },
};
