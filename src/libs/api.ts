import type {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import axios from 'axios';
import { ApiException } from '../exceptions/ApiException.ts';
import { ERROR_MESSAGE } from '../exceptions/constants/errorMessage';

const BASE_URL = 'http://localhost:8080/onboarding/api';

const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - 모든 요청에 Authorization 헤더 추가
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('🔑 Token added to request');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - 데이터 언래핑 및 토큰 만료 시 자동 갱신
api.interceptors.response.use(
    (response: AxiosResponse) => {
        console.log('✅ API Response:', response.status, response.config.url);
        // 응답 데이터 언래핑: response.data만 반환
        return response.data;
    },
    async (error) => {
        console.error('❌ API Error:', error.response?.status, error.config?.url, error.message);
        const originalRequest = error.config;

        // 401 에러이고, 재시도하지 않은 요청인 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    // 토큰 갱신 시도
                    const response = await axios.post(`${BASE_URL}/auth/refresh`, {
                        refreshToken,
                    });

                    const { accessToken } = response.data.data;
                    localStorage.setItem('accessToken', accessToken);

                    // 원본 요청을 새로운 토큰으로 재시도
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // 리프레시 토큰도 만료된 경우 로그아웃
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';

                    // ApiException으로 변환
                    return Promise.reject(
                        new ApiException(ERROR_MESSAGE.TOKEN_EXPIRED, 401, 'TOKEN_EXPIRED')
                    );
                }
            } else {
                // 리프레시 토큰이 없는 경우 로그인 페이지로 이동
                window.location.href = '/login';

                // ApiException으로 변환
                return Promise.reject(
                    new ApiException(ERROR_MESSAGE.UNAUTHORIZED, 401, 'NO_TOKEN')
                );
            }
        }

        // 에러를 ApiException으로 변환
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

        return Promise.reject(new ApiException(message, status, code));
    }
);

export default api;