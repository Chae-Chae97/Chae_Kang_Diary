import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// ⭐ 이 두 줄이 반드시 있어야 아래에서 에러가 안 납니다!
import { User } from '../entities/user.entity';
import { Diary } from '../entities/diary.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Diary], // 👈 이제 여기서 빨간 줄이 사라질 거예요!
      synchronize: true, 
    }),
    TypeOrmModule.forFeature([User, Diary]), // 👈 여기도 마찬가지!
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}