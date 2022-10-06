import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Response<T> {
  message: string;
  data: T;
}

@Injectable()
export class TransformHttpResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const statusCode = context.switchToHttp().getResponse().statusCode;

    return next.handle().pipe(
      map((data) => ({
        status_code: statusCode,
        status: 'Success',
        message: 'Success',
        timestamp: new Date().toISOString(),
        data,
      })),
    );
  }
}
