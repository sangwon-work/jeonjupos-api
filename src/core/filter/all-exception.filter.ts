import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch() // 매개변수 없음 = 모든 예외를 잡음
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const resp = exception.getResponse();

      // Nest의 HttpException은 string 또는 { message, error, statusCode } 형태
      const message =
        typeof resp === 'string'
          ? resp
          : Array.isArray((resp as any)?.message)
          ? (resp as any).message.join(', ')
          : (resp as any)?.message ?? exception.message;

      return response.status(status).json({
        rescode: String(status),
        message: message ?? HttpStatus[status] ?? 'Error',
        data: null,
      });
    }

    response.status(500).json({
      rescode: '9999',
      message: (exception as Error).message || 'Internal server error',
    });
  }
}
