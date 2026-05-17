import * as dotenv from 'dotenv';
import * as path from 'path';
// 🚀 최상단에서 환경 변수를 가장 먼저 로드합니다.
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Today's Backend & Frontend Integration Completed!
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ... 생략

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ⭐ 전역 예외 필터 적용!
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors();

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}
bootstrap();
