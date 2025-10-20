/**
 * 공통 타입 정의
 */

// API 응답
export interface ApiResponse<T> {
  httpStatus: string;
  message: string;
  data: T;
}

// 페이지네이션
export interface PaginationParams {
  page: number;
  size: number;
}

// 정렬
export interface SortParams {
  orderType?: string;
  order?: 'asc' | 'desc';
}