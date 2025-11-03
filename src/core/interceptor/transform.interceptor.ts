// transform.interface.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../../shared/types/api-response';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const req = context.switchToHttp().getRequest();

    // 특정 경로 또는 메서드 제외
    if (req.url.includes('')) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        return {
          rescode: data.rescode,
          message: data.message,
          body: data.body ?? {},
        };
      }),
    );
  }
}
