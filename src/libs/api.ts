import type {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import axios from 'axios';
import { ApiException } from '../exceptions/ApiException.ts';
import { ERROR_MESSAGE } from '../exceptions/constants/errorMessage';
import { errorManager } from './errorManager';

const BASE_URL = 'http://localhost:8080/onboarding/api';

const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response: AxiosResponse) => {
        console.log('✅ API Response:', response.status, response.config.url);
        return response.data;
    },
    async (error) => {
        console.error('❌ API Error:', error.response?.status, error.config?.url, error.message);
        const originalRequest = error.config;

        // 401 에러이고, 재시도하지 않은 요청인 경우
        // /auth/refresh 요청 자체는 제외
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (originalRequest.url?.includes('/auth/refresh')) {
                return Promise.reject(
                    new ApiException(ERROR_MESSAGE.TOKEN_EXPIRED, 401, 'REFRESH_FAILED')
                );
            }

            originalRequest._retry = true;

            try {
                // 토큰 갱신
                await axios.post(
                    `${BASE_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(
                    new ApiException(ERROR_MESSAGE.TOKEN_EXPIRED, 401, 'TOKEN_EXPIRED')
                );
            }
        }

        const status = error.response?.status;
        const backendMessage = error.response?.data?.message;
        const code = error.response?.data?.code;

        let message = backendMessage;

        if (!message) {
            switch (status) {
                case 400:
                    message = ERROR_MESSAGE.BAD_REQUEST;
                    break;
                case 401:
                    message = ERROR_MESSAGE.UNAUTHORIZED;
                    break;
                case 403:
                    message = ERROR_MESSAGE.FORBIDDEN;
                    break;
                case 404:
                    message = ERROR_MESSAGE.NOT_FOUND;
                    break;
                case 500:
                case 502:
                case 503:
                    message = ERROR_MESSAGE.SERVER_ERROR;
                    break;
                default:
                    message = error.message || ERROR_MESSAGE.UNKNOWN_ERROR;
            }
        }

        const apiException = new ApiException(message, status, code);

        // 전역 에러 표시
        errorManager.setError(apiException.message);

        return Promise.reject(apiException);
    }
);

export default api;