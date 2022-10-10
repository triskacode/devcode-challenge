import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TimerResponseHttpInterceptor implements NestInterceptor {
  private logger = new Logger(TimerResponseHttpInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    const now = Date.now();
    return next.handle().pipe(
      tap({
        next: () =>
          this.logger.debug(
            `complete request ${request.url} in ${Date.now() - now} ms`,
          ),
        error: (err) =>
          this.logger.debug(
            `error ${
              err instanceof HttpException
                ? err.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR
            } requesting ${request.url} in ${Date.now() - now} ms`,
          ),
      }),
    );
  }
}
