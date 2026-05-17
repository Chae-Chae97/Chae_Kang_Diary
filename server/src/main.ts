import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './http-exception.filter';
import * as dotenv from 'dotenv'; 
import * as path from 'path';

async function bootstrap() {
  dotenv.config({ path: path.join(process.cwd(), '.env') }); 

  const app = await NestFactory.create(AppModule);

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