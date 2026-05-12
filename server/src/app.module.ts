import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { Diary } from '../entities/diary.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'myuser',
      password: 'mypassword',
      database: 'diary_db',
      entities: [User, Profile, Diary],
      synchronize: true, // 개발 환경에서 엔티티 변경사항을 DB에 자동 반영합니다.
    }),
    TypeOrmModule.forFeature([User, Profile, Diary]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}