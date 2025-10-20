/**
 * 장치 관련 타입 정의
 */

// 장치 엔티티
export interface Device {
  deviceId: number;
  modelId?: number;
  title: string;
  modelName: string;
  regDate: string;
}

// 장치 생성/수정 요청
export interface DeviceRequest {
  title: string;
  modelName: string;
}

// 장치 생성/수정 응답
export interface DeviceResponse {
  deviceId: number;
  title: string;
  modelName: string;
  regDate: string;
}

// 장치 목록 조회 응답
export interface DeviceListResponse {
  devices: Device[];
  currentPageNo: number;
  sizePerPage: number;
  totalCnt: number;
  pageCnt: number;
  prev: boolean;
  next: boolean;
}
