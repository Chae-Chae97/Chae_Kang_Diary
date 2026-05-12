import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // 👈 1. 검문소 도구 가져오기
import * as dotenv from 'dotenv'; 
import path from 'path';

async function bootstrap() {
  dotenv.config({ path: path.join(__dirname, '..', '.env') }); 

  const app = await NestFactory.create(AppModule);
  
  // ⭐ 2. 전역 검문소(ValidationPipe) 설치!
  // 이제 모든 요청은 DTO에 적힌 규칙을 통과해야만 컨트롤러로 들어갈 수 있습니다.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,               // DTO에 없는 속성은 자동으로 제거
      forbidNonWhitelisted: true,    // DTO에 없는 속성이 들어오면 요청 자체를 막음
      transform: true,               // 데이터를 자동으로 DTO 클래스 객체로 변환
    }),
  );

  app.enableCors();
  
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Server is running on port ${port}`); 
}
bootstrap();