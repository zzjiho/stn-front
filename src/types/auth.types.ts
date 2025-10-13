/**
 * 인증 관련 타입 정의
 */

// 로그인 요청
export interface LoginRequest {
  username: string;
  password: string;
}

// 회원가입 요청
export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

// 로그인 응답
export interface LoginResponse {
  username: string;
  role: 'USER' | 'ADMIN';
}

// 토큰 재발급 응답
export interface RefreshResponse {
  userInfo: {
    username: string;
    role: 'USER' | 'ADMIN';
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

// 회원가입 응답
export interface SignupResponse {
  userId: number;
  username: string;
  email: string;
}

// 리프레시 토큰 요청
export interface RefreshTokenRequest {
  refreshToken: string;
}
