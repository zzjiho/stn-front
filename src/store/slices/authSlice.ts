/**
 * 인증 상태 (로그인 여부, 사용자 토큰 등)를 관리하는 Redux 슬라이스
 */

import type {PayloadAction} from '@reduxjs/toolkit';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import type {LoginRequest, SignupRequest} from '../../types/index';
import {authService} from '../../services/authService';
import {ApiException} from '../../exceptions/ApiException';

interface AuthState {
    user: {
        username: string;
        role: 'USER' | 'ADMIN';
    } | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

// Async thunks
export const loginAsync = createAsyncThunk(
    'auth/login',
    async (credentials: LoginRequest, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);
            return response;
        } catch (error) {
            if (ApiException.isApiException(error)) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('로그인에 실패했습니다.');
        }
    }
);

export const signupAsync = createAsyncThunk(
    'auth/signup',
    async (userData: SignupRequest, { rejectWithValue }) => {
        try {
            const response = await authService.signup(userData);
            return response;
        } catch (error) {
            if (ApiException.isApiException(error)) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('회원가입에 실패했습니다.');
        }
    }
);

export const logoutAsync = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authService.logout();
        } catch (error) {
            if (ApiException.isApiException(error)) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('로그아웃에 실패했습니다.');
        }
    }
);

export const checkAuthAsync = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.checkAuth();
            return response;
        } catch (error) {
            if (ApiException.isApiException(error)) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('인증 확인에 실패했습니다.');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setUser: (state, action: PayloadAction<{ username: string; role: 'USER' | 'ADMIN' }>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                const { username, role } = action.payload.data;
                state.user = { username, role };
                state.isAuthenticated = true;
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Signup
            .addCase(signupAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signupAsync.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(signupAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Logout
            .addCase(logoutAsync.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            // Check Auth
            .addCase(checkAuthAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuthAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                const { username, role } = action.payload.data.userInfo;
                state.user = { username, role };
                state.isAuthenticated = true;
            })
            .addCase(checkAuthAsync.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
            });
    },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;