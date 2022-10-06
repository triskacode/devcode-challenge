import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformHttpResponseInterceptor } from './common/interceptors/transform-http-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const adapterHost = app.get(HttpAdapterHost);
  const config = app.get(ConfigService);

  app.enableCors(config.get('app.cors'));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter(adapterHost));
  app.useGlobalInterceptors(new TransformHttpResponseInterceptor());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(config.get('app.port'));
}
bootstrap();
