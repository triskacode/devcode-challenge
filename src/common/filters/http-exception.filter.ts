import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(HttpException)
export class HttpExceptionFilter<T extends Error> implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: T, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const { httpAdapter } = this.httpAdapterHost;

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception instanceof BadRequestException
          ? (exception.getResponse() as any)?.error
          : exception.message
        : 'Internal server error';

    const responseBody = {
      status_code: httpStatus,
      message,
      timestamp: new Date().toISOString(),
      ...(exception instanceof BadRequestException
        ? { errors: (exception.getResponse() as any)?.message }
        : {}),
    };

    Logger.error(exception.message, 'HttpExceptionFilter');

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
