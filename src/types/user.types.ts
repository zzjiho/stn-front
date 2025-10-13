/**
 * 사용자 관련 타입 정의
 */

// 사용자 엔티티
export interface User {
  userId: number;
  username: string;
  email: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  role: 'USER' | 'ADMIN';
}

// 사용자 상태 변경 요청
export interface UserStatusRequest {
  status: 'APPROVED' | 'REJECTED';
}
