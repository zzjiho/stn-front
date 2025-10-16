import type {AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import axios, { type AxiosError } from 'axios';
import { ApiException } from '../exceptions/ApiException.ts';
import { ERROR_MESSAGE } from '../exceptions/constants/errorMessage';
import { errorManager } from './errorManager';

// retry 플래그 추가한 Axios 요청 설정 타입
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// Error Response
interface BackendErrorResponse {
    errorMessage?: string;
    message?: string;
    errorCode?: string;
    code?: string;
}

const BASE_URL = 'http://localhost:8080/onboarding/api';

const api: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// Response interceptor
api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response.data;
    },

    // 에러 응답 처리
    async (error: AxiosError<BackendErrorResponse>) => {
        const originalRequest = error.config as RetryableRequestConfig;
        const is401Error = error.response?.status === 401;
        const notRetried = !originalRequest._retry;

        if (is401Error && notRetried && !isAuthRequest(originalRequest.url)) {
            return refreshTokenAndRetry(originalRequest);
        }

        const status = error.response?.status;
        const message = extractErrorMessage(error);
        const code = error.response?.data?.errorCode || error.response?.data?.code;

        const apiException = new ApiException(message, status, code);
        errorManager.setError(apiException.message);

        return Promise.reject(apiException);
    }
);

/**
 * 인증 관련 요청인지 확인
 */
const isAuthRequest = (url?: string): boolean => {
    return url?.includes('/auth/login') || url?.includes('/auth/refresh') || false;
};

/**
 * 토큰 갱신 및 요청 재시도
 */
const refreshTokenAndRetry = async (originalRequest: RetryableRequestConfig) => {
    originalRequest._retry = true;

    try {
        await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        return api(originalRequest);
    } catch {
        throw new ApiException(ERROR_MESSAGE.TOKEN_EXPIRED, 401, 'TOKEN_EXPIRED');
    }
};

/**
 * 에러 메시지 추출
 */
const extractErrorMessage = (error: AxiosError<BackendErrorResponse>): string => {
    const backendMessage = error.response?.data?.errorMessage || error.response?.data?.message;

    if (backendMessage) {
        return backendMessage;
    }

    const status = error.response?.status;
    switch (status) {
        case 400:
            return ERROR_MESSAGE.BAD_REQUEST;
        case 401:
            return ERROR_MESSAGE.UNAUTHORIZED;
        case 403:
            return ERROR_MESSAGE.FORBIDDEN;
        case 404:
            return ERROR_MESSAGE.NOT_FOUND;
        case 500:
        case 502:
        case 503:
            return ERROR_MESSAGE.SERVER_ERROR;
        default:
            return error.message || ERROR_MESSAGE.UNKNOWN_ERROR;
    }
};


export default api;