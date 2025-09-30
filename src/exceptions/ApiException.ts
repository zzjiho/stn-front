/**
 * API 에러를 일관되게 처리하기 위한 커스텀 예외 클래스
 */
export class ApiException extends Error {
  public readonly status?: number;
  public readonly code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.code = code;

    Object.setPrototypeOf(this, ApiException.prototype);
  }

    static isApiException(error: unknown): error is ApiException {
        return error instanceof ApiException;
    }
}