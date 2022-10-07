import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch(HttpException)
export class HttpExceptionFilter<T extends Error> implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: T, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const { httpAdapter } = this.httpAdapterHost;

    let status: string;
    let message: string;

    switch (exception.constructor) {
      case BadRequestException:
        status = 'Bad Request';
        message = (exception as any).getResponse().message[0];
        break;
      case NotFoundException:
        status = 'Not Found';
        message = exception.message;
        break;
      default:
        status = 'Internal Server Error';
        message =
          exception instanceof HttpException
            ? exception.message
            : 'Whoops, something went wrong';
    }

    const responseBody = {
      status,
      message,
      data: {},
    };

    httpAdapter.reply(
      ctx.getResponse(),
      responseBody,
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
