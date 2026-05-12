import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'; 
import path from 'path';

async function bootstrap() {
  dotenv.config({ path: path.join(__dirname, '..', '.env') }); 

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Server is running on port ${port}`); 
}
bootstrap();