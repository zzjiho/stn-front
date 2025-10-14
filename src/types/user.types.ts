/**
 * 사용자 관련 타입 정의
 */

// 사용자 엔티티
export interface User {
  id: number;
  username: string;
  email: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

// 사용자 목록 조회 응답
export interface UserListResponse {
  users: User[];
  currentPageNo: number;
  sizePerPage: number;
  totalCnt: number;
  pageCnt: number;
  prev: boolean;
  next: boolean;
}

// 사용자 상세 조회 응답
export interface UserDetailResponse {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

// 사용자 상태 변경 요청
export interface UserStatusRequest {
  status: 'APPROVED' | 'REJECTED';
}

// 사용자 상태 변경 응답
export interface UserStatusResponse {
  id: number;
  username: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}
