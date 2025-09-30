/**
 * 공통 에러 메시지 상수
 */
export const ERROR_MESSAGE = {
  // 네트워크 관련
  NETWORK_ERROR: '네트워크 오류가 발생했습니다. 다시 시도해주세요.',
  TIMEOUT: '응답 시간을 초과했습니다. 다시 시도해주세요.',

  // 인증 관련
  UNAUTHORIZED: '로그인이 필요합니다.',
  TOKEN_EXPIRED: '인증이 만료되었습니다. 다시 로그인해주세요.',
  FORBIDDEN: '접근 권한이 없습니다.',

  // 서버 관련
  SERVER_ERROR: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  BAD_REQUEST: '잘못된 요청입니다.',
  NOT_FOUND: '요청하신 정보를 찾을 수 없습니다.',

  // 기타
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
} as const;