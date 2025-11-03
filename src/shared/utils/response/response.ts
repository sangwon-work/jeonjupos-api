import { ApiResponse } from '../../types/api-response';
import { ResCode, RES_CODE } from './rescode';

/**
 * message가 주어지면 그대로 사용,
 * 빈 문자열이거나 undefined/null이면 RES_CODE의 기본 메시지 사용
 */
function pickMessage(code: ResCode, msg?: string | null): string {
  const custom = (msg ?? '').trim();
  return custom !== '' ? custom : RES_CODE[code] ?? '';
}

export function respond<T>(
  code: ResCode,
  message: string,
  body: T,
): ApiResponse<T> {
  return {
    rescode: code,
    message: pickMessage(code, message),
    body,
  };
}
