// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // process.env.PORT가 3000으로 잡혀있을 수 있으니, 테스트를 위해 4000으로 고정!
  await app.listen(4000); 
  console.log(`🚀 서버가 4000번 포트에서 실행 중입니다!`);
}
bootstrap();