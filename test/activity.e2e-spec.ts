import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

describe('ActivityController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/activity-groups (GET)', () => {
    return request(app.getHttpServer()).get('/activity-groups').expect(200);
  });

  it('/activity-groups?email=wow@gmail.com (GET)', () => {
    return request(app.getHttpServer())
      .get('/activity-groups?email=wow@gmail.com')
      .expect(200);
  });
});
