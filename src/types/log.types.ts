/**
 * 로그(장치 사용량) 관련 타입 정의
 */

// 로그 엔티티
export interface Log {
  usageId: number;
  deviceId: number;
  title: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  regDate: string;
  updDate: string;
}

// 로그 생성/수정 요청
export interface LogRequest {
  deviceId: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

// 로그 생성/수정 응답
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

// 로그 목록 조회 응답
export interface LogListResponse {
  deviceUsages: Log[];
  currentPageNo: number;
  sizePerPage: number;
  totalCnt: number;
  pageCnt: number;
  prev: boolean;
  next: boolean;
}
