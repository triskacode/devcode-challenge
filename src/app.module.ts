import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { ActivityModule } from './modules/activity/activity.module';
import { TodoModule } from './modules/todo/todo.module';
import DatabaseConfig from './config/database.config';
import AppConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppConfig, DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.user'),
        password: configService.get('database.password'),
        database: configService.get('database.dbname'),
        entities: [__dirname + '/../**/entities/*.entity.{ts,js}'],
        autoLoadEntities: true,
      }),
    }),
    ActivityModule,
    TodoModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
