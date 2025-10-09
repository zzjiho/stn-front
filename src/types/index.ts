// API Response types
export interface ApiResponse<T> {
  httpStatus: string;
  message: string;
  data: T;
}

// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  role: 'USER' | 'ADMIN';
}

export interface SignupResponse {
  userId: number;
  username: string;
  email: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Device types
export interface Device {
  deviceId: number;
  modelId?: number;
  title: string;
  modelName: string;
  regDate: string;
}

export interface DeviceRequest {
  title: string;
  modelName: string;
}

export interface DeviceResponse {
  deviceId: number;
  title: string;
  regDate: string;
}

export interface DeviceListResponse {
  devices: Device[];
  currentPageNo: number;
  sizePerPage: number;
  totalCnt: number;
  pageCnt: number;
  prev: boolean;
  next: boolean;
}

// User types
export interface User {
  userId: number;
  username: string;
  email: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  role: 'USER' | 'ADMIN';
}

export interface UserStatusRequest {
  status: 'APPROVED' | 'REJECTED';
}

// Log types
export interface LogResponse {
  usageId: number;
  deviceId: number;
  title: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  regDate: string;
  updDate: string;
}

export interface LogRequest {
  deviceId: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

export interface LogListResponse {
  deviceUsages: LogResponse[];
  currentPageNo: number;
  sizePerPage: number;
  totalCnt: number;
  pageCnt: number;
  prev: boolean;
  next: boolean;
}

// Common types
export interface PaginationParams {
  page: number;
  size: number;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}