import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// ⭐ Profile 엔티티 임포트 추가
import { User } from '../entities/user.entity';
import { Diary } from '../entities/diary.entity';
import { Profile } from '../entities/profile.entity'; // 👈 추가된 부분

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
      // ⭐ 관리할 엔티티 목록에 Profile 추가
      entities: [User, Diary, Profile], 
      synchronize: true, 
    }),
    // ⭐ Repository를 사용하기 위해 Profile 추가
    TypeOrmModule.forFeature([User, Diary, Profile]), 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}