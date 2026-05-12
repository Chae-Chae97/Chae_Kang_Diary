// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ⭐ 전역 유효성 검사 파이프 적용
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // DTO에 없는 속성은 거름
    forbidNonWhitelisted: true, // 이상한 값 들어오면 에러 던짐
    transform: true, // 데이터를 DTO 타입으로 자동 변환
  }));
  // process.env.PORT가 3000으로 잡혀있을 수 있으니, 테스트를 위해 4000으로 고정!
  await app.listen(4000); 
  console.log(`🚀 서버가 4000번 포트에서 실행 중입니다!`);
}
bootstrap();